var chai = require('chai');
var chaiHttp = require('chai-http');
var server = require('../server');
var should = chai.should();

chai.use(chaiHttp);

describe('Election information API', function () {
	before(function () {
		server.start();
	});

	describe('Tests', function() {

	  it('Should return valid JSON with GET', function(done) {
	  	chai.request(server.app)
	  	.get('/?house_num=1500&street_name=South%20Geddes%20Street&zip=13207')
	  	    .end(function(err, res){
		      res.should.have.status(200);
		      res.should.be.json;
		      done();
		    });
	  });

	  it('Should require all parameters with GET', function(done) {
	  	chai.request(server.app)
	  	.get('/?house_num=1500&street_name=South%20Geddes%20Street')
	  	    .end(function(err, res){
		      res.should.have.status(400);
		      res.should.be.json;
		      done();
		    });
	  });

	  it('Should return valid JSON with POST', function(done) {
	  	chai.request(server.app)
	  	.post('/')
	  	.send({'house_num': 1500, 'street_name': 'South Geddes Street', 'zip': 13207})
	  	    .end(function(err, res){
		      res.should.have.status(200);
		      res.should.be.json;
		      done();
		    });
	  });

	  it('Should require all parameters with POST', function(done) {
	  	chai.request(server.app)
	  	.post('/')
	  	.send({'house_num': 1500, 'street_name': 'South Geddes Street'})
	  	    .end(function(err, res){
		      res.should.have.status(400);
		      res.should.be.json;
		      done();
		    });
	  });

	});

	after(function () {
		server.stop();
	});
});