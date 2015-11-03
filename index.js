// Include required modules.
var request = require('request');
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

// Validation of required address parts.
function validateAddressParts(body) {
	house_num = body.house_num;
	street_name = body.street_name;
	apartment = body.apartment;
	zip = body.zip;
}

// Serve static web assets.
app.use(express.static(__dirname + '/public'));

app.post('/', function(req, res) {
	validateAddressParts(req.body);
	if (house_num && street_name && zip) {
		request(URL, function (error, response, body) {
			if (!error && response.statusCode == 200) {

				// Get the viewstate & related bits for polling place lookup.
				var viewStateData = utilities.getViewState(body);

				// Assemble form data to be sent with subsequent request.
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

				// POST form data to do location lookup.
				request.post({url:URL, form: formData}, function (error, response, body) {
				  if (!error && response.statusCode == 200) {

				    // Construct JSON object with polling location information.
				    var pollingLocation = utilities.getLocationInfo(body);

				    // Send response.
				    res.set('Content-type', 'application/json');
				    res.send(pollingLocation);
				  }
				  else {
				  	res.status(500).send("Unable to retrieve polling location information.");
				  }
				});
				
			}
			else {
				res.status(500).send("Unable to access County polling location website.");
			}
		});
	}
	else {
		res.status(400).send("Invalid request. Must POST house_num, street_name and zip.");
	}
});