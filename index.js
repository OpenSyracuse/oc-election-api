// Include required modules.
var request = require('request');
var async = require('async');
var express = require('express');
var bodyParser = require('body-parser');
var utilities = require('./utils/parser'); 

// Start express app.
var app = express();
app.use(bodyParser.json());
app.listen(4000);

// URL to County polling location website.
var URL = 'http://vic.ntsdata.com/onondagaboe/pollingplacelookup.aspx';

// Address parts for polling location lookup.
var house_num, street_name, apartment, zip;

// Route for polling location lookup.
app.post('/', function(req, res) {
	async.waterfall([ 
		async.apply(getFormData, req.body), 
		getPollingInfo 
		],
		// Process response and send to user.
		function (error, body) {
			if(!error) {
				var pollingLocation = utilities.getLocationInfo(body);
				res.json(pollingLocation);
			}
			else {
				var error_message = error.message.length >0 ? error.message  : "Unable to retrieve polling location information.";
				var error_code = error.code > 0 ? error.code : 500;
				res.status(error_code).json({error: error_message});
			}
	});
});

// Get the viewstate & related bits for polling place lookup.
function getFormData(body, callback) {
	validateAddressParts(body);
	if (house_num && street_name && zip) {
		request(URL, function (error, response, body) {
			callback(error, body);
		});
	}
	else {
		callback({message: "Invalid request. Must POST house_num, street_name and zip.", code: 400});
	}
}

// Assemble form data to be sent with subsequent request.
function getPollingInfo(body, callback) {
	
	var viewStateData = utilities.getViewState(body);
	var formData = {
		__VIEWSTATE: viewStateData.viewState,
		__VIEWSTATEGENERATOR: viewStateData.viewStateGenerator,
		__EVENTVALIDATION: viewStateData.eventValidation,
		czip: zip,
		cstreet_no: house_num,
		cstreet_nm: street_name,
		capartment: apartment,
		cmdlookup: 'Lookup'
	};
	request.post({url:URL, form: formData}, function (error, response, body) {
		callback(error, body);
	});
}

// Validation of required address parts.
function validateAddressParts(body) {
	house_num = body.house_num;
	street_name = body.street_name;
	apartment = body.apartment;
	zip = body.zip;
}