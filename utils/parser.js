var cheerio = require('cheerio');

exports.getViewState = function (body) {
	$=cheerio.load(body);
	var viewState = $('#__VIEWSTATE').attr('value');
	var viewStateGenerator = $('#__VIqqEWSTATEGENERATOR').attr('value');
	var eventValidation = $('#__EVENTVALIDATION').attr('value');
	return { viewState: viewState, viewStateGenerator: viewStateGenerator, eventValidation: eventValidation };
};

exports.getLocationInfo = function (body) {
	$=cheerio.load(body);
				    
	var pollingLocation = {
	   	name: removeSpaces($('#tblcPollAddress1').text()) || null,
	   	fullAddress: removeSpaces($('#tblcPollAddress2').text()) + ' ' + removeSpaces($('#tblcPollAddress3').text()) + ' ' + removeSpaces($('#tblcPollAddress4').text()),
	   	disabled: removeSpaces($('#tblcPollHandicap').text()) || null,
	   	town: removeSpaces($('#tblctown').text()) || null,
	   	ward: removeSpaces($('#tblcward').text()) || null,
	   	district: removeSpaces($('#tblcdistrict').text()) || null,
	   	school: removeSpaces($('#tblcschl').text()) || null,
	   	congress: removeSpaces($('#tblccong').text()) || null,
	   	senate: removeSpaces($('#tblcstsen').text()) || null,
	   	assembly: removeSpaces($('#tblcstleg').text()) || null,
	   	otherDistrict1: removeSpaces($('#tblcothr1').text()) || null,
	   	otherDistrict2: removeSpaces($('#tblcothr2').text()) || null,
	   	otherDistrict3: removeSpaces($('#tblcothr3').text()) || null,
	   	otherDistrict4: removeSpaces($('#tblcothr4').text() )|| null
	}
	return pollingLocation;
};

function removeSpaces(text) {
	return text.replace(/^\s+|\s+$/g,'');
}