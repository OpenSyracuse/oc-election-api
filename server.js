// Include required modules.
var request = require('request');
var async = require('async');
var express = require('express');
var bodyParser = require('body-parser');
var utilities = require('./utils/parser');
var config = require('./config').config;

// Set up Express app.
var app = express();
app.use(bodyParser.json());
var server;

exports.start = function () {
	var port = process.argv[2] || 4000;
	server = app.listen(port);
}
exports.stop = function() {
	server.close();
}
exports.app = app;

// Address parts for polling location lookup.
var house_num, street_name, apartment, zip;

// Default route for GETs
app.get('/', function(req, res) {
	if(!req.query.house_num || !req.query.street_name || !req.query.zip) {
		res.status(400).json({message: 'Invalid request. Expected house_num, street_name and zip parameters.'});
	}
	else {
		processRequest(req, res);
	}
});

// Route for polling location lookup.
app.post('/', function(req, res) {
	if(Object.keys(req.body).length === 0) {
		res.status(400).json({message: 'You must send a body with request.'});
	}
	else {
		processRequest(req, res);
	}
});

function processRequest(req, res) {
var address = req.method == 'POST' ? req.body : req.query;
async.waterfall([ 
	async.apply(getFormData, address), 
	getPollingInfo 
	],
	// Process response and send to user.
	function (error, address) {
		if(!error) {
			var pollingLocation = utilities.getLocationInfo(address);
			if(req.query.callback) {
				res.jsonp(pollingLocation);
			}
			else {
				res.json(pollingLocation);
			}
		}
		else {
			var error_message = error.message.length > 0 ? error.message  : "Unable to retrieve polling location information.";
			var error_code = error.code > 0 ? error.code : 500;
			res.status(error_code).json({error: error_message});
		}
	});
}

// Get the viewstate & related bits for polling place lookup.
function getFormData(address, callback) {
	validateAddressParts(address);
	if (house_num && street_name && zip) {
		request(config.URL, function (error, response, address) {
			callback(error, address);
		});
	}
	else {
		callback({message: "Invalid request. Must POST house_num, street_name and zip.", code: 400});
	}
}

// Assemble form data to be sent with subsequent request.
function getPollingInfo(address, callback) {
	
	var viewStateData = utilities.getViewState(address);
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
	request.post({url:config.URL, form: formData}, function (error, response, address) {
		callback(error, address);
	});
}

// Validation of required address parts.
function validateAddressParts(address) {
	house_num = address.house_num;
	street_name = address.street_name;
	apartment = address.apartment;
	zip = address.zip;
}