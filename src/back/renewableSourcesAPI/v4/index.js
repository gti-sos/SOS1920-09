module.exports = function (app) {
	console.log("Registering renewable source stats API...");
	const dataStore = require("nedb");
	const path = require("path");
	const dbFileName = path.join(__dirname, "renewable_sources_stats.db");
	const BASE_API_URL = "/api/v4";

	const request = require('request');
	const express = require("express");
	var api07 = 'https://sos1920-07.herokuapp.com';
	var path07 = '/api/v2/foodsImports';
	var api05 = 'https://sos1920-05.herokuapp.com';
	var path05 = '/api/v1/books-exports';
	var api6 = 'https://sos1920-06.herokuapp.com';
	var path6 = '/api/v2/lottery-sales';
	var api1 = 'https://sos1920-01.herokuapp.com';
	var path1 = '/api/v2/natality-stats';
	var api23 = 'https://sos1920-23.herokuapp.com';
	var path23 = '/api/v2/cigarretes-sales';
	var api25 = 'https://sos1920-25.herokuapp.com';
	var path25 = '/api/v2/happiness_rate';
	var api8 = 'https://sos1920-08.herokuapp.com';
	var path8 = '/api/v1/motogp-statistics';

	var apiExt = 'http://countryapi.gear.host';
	var pathExt = '/v1/Country/getCountries';
	
	const db = new dataStore({
		filename: dbFileName,
		autoload: true
	});
	
	/* Pipes */
	app.use(path07, function(req, res) {
		var url = api07 + req.baseUrl + req.url;
		console.log('piped: ' + req.baseUrl + req.url);
		req.pipe(request(url)).pipe(res);
	});
	app.use(express.static('.'));

	app.use(path05, function(req, res) {
		var url = api05 + req.baseUrl + req.url;
		console.log('piped: ' + req.baseUrl + req.url);
		req.pipe(request(url)).pipe(res);
	});
	app.use(express.static('.'));

	app.use(path6, function(req, res) {
		var url = api6 + req.baseUrl + req.url;
		console.log('piped: ' + req.baseUrl + req.url);
		req.pipe(request(url)).pipe(res);
	});
	app.use(express.static('.'));

	app.use(path1, function(req, res) {
		var url = api1 + req.baseUrl + req.url;
		console.log('piped: ' + req.baseUrl + req.url);
		req.pipe(request(url)).pipe(res);
	});
	app.use(express.static('.'));

	app.use(path23, function(req, res) {
		var url = api23 + req.baseUrl + req.url;
		console.log('piped: ' + req.baseUrl + req.url);
		req.pipe(request(url)).pipe(res);
	});
	app.use(express.static('.'));

	app.use(path25, function(req, res) {
		var url = api25 + req.baseUrl + req.url;
		console.log('piped: ' + req.baseUrl + req.url);
		req.pipe(request(url)).pipe(res);
	});
	app.use(express.static('.'));

	app.use(path8, function(req, res) {
		var url = api8 + req.baseUrl + req.url;
		console.log('piped: ' + req.baseUrl + req.url);
		req.pipe(request(url)).pipe(res);
	});
	app.use(express.static('.'));

	app.use(pathExt, function(req, res) {
		var url = apiExt + req.baseUrl + req.url;
		console.log('piped: ' + req.baseUrl + req.url);
		req.pipe(request(url)).pipe(res);
	});
	app.use(express.static('.'));

	


	var initialRenewableSourcesStats = [
		{ 
			"country": "Spain",
			"year": 2016,
			"percentage-re-total": 38.1,
			"percentage-hydropower-total": 14.5,
			"percentage-wind-power-total": 17.8

		},
		{ 
			"country": "France",
			"year": 2016,
			"percentage-re-total": 17.5,
			"percentage-hydropower-total": 11.7,
			"percentage-wind-power-total": 3.8

		},
		{ 
			"country": "Russia",
			"year": 2016,
			"percentage-re-total": 16.9,
			"percentage-hydropower-total": 17.0,
			"percentage-wind-power-total": 0.0

		},
		{ 
			"country": "Canada",
			"year": 2016,
			"percentage-re-total": 65.0,
			"percentage-hydropower-total": 58.0,
			"percentage-wind-power-total": 4.6

		},
		{ 
			"country": "Italy",
			"year": 2016,
			"percentage-re-total": 17.2,
			"percentage-hydropower-total": 32.7,
			"percentage-wind-power-total": 12.4

		},
		{ 
			"country": "India",
			"year": 2018,
			"percentage-re-total": 7.4,
			"percentage-hydropower-total": 34.9,
			"percentage-wind-power-total": 10.8

		},
		{ 
			"country": "Finland",
			"year": 2017,
			"percentage-re-total": 21.3,
			"percentage-hydropower-total": 38.8,
			"percentage-wind-power-total": 11.7

		},
		{ 
			"country": "New Zealand",
			"year": 2017,
			"percentage-re-total": 6.1,
			"percentage-hydropower-total": 87.7,
			"percentage-wind-power-total": 31.0

		},
		{ 
			"country": "Panama",
			"year": 2017,
			"percentage-re-total": 8.1,
			"percentage-hydropower-total": 77.7,
			"percentage-wind-power-total": 32.1

		},
		{ 
			"country": "Panama",
			"year": 2018,
			"percentage-re-total": 8.5,
			"percentage-hydropower-total": 84.7,
			"percentage-wind-power-total": 44.3

		},
		{ 
			"country": "Finland",
			"year": 2016,
			"percentage-re-total": 11.3,
			"percentage-hydropower-total": 28.8,
			"percentage-wind-power-total": 1.7

		},
		{ 
			"country": "Poland",
			"year": 2016,
			"percentage-re-total": 10.3,
			"percentage-hydropower-total": 58.8,
			"percentage-wind-power-total": 2.9

		},
		{ 
			"country": "Poland",
			"year": 2017,
			"percentage-re-total": 34.3,
			"percentage-hydropower-total": 59.8,
			"percentage-wind-power-total": 4.0

		},
		{ 
			"country": "Switzerland",
			"year": 2016,
			"percentage-re-total": 28.7,
			"percentage-hydropower-total": 48.8,
			"percentage-wind-power-total": 1.9

		},
		{ 
			"country": "Switzerland",
			"year": 2017,
			"percentage-re-total": 44.2,
			"percentage-hydropower-total": 69.3,
			"percentage-wind-power-total": 4.2

		},
		{
			"country": "Mexico",
			"year": 2015,
			"percentage-re-total": 24.2,
			"percentage-hydropower-total": 89.3,
			"percentage-wind-power-total": 1.3

		},
		{
			"country": "France",
			"year": 2015,
			"percentage-re-total": 18.3,
			"percentage-hydropower-total": 15.7,
			"percentage-wind-power-total": 61.8
		},
		{
			"country": "Mexico",
			"year": 2016,
			"percentage-re-total": 24.2,
			"percentage-hydropower-total": 89.7,
			"percentage-wind-power-total": 1.7
		},
		{
			"country": "Germany",
			"year": 2019,
			"percentage-re-total": 44.2,
			"percentage-hydropower-total": 99.9,
			"percentage-wind-power-total": 8.7
		},
		{
			"country": "Spain",
			"year": 2019,
			"percentage-re-total": 47.2,
			"percentage-hydropower-total": 34.5,
			"percentage-wind-power-total": 54.1
		},
		{
			"country": "Spain",
			"year": 2009,
			"percentage-re-total": 8.5,
			"percentage-hydropower-total": 4.6,
			"percentage-wind-power-total": 8.1
		},

		
		
	];
	
	// Cleaning the data base and inserting the initial data
	db.remove({}, { multi: true }); // Deleting elements one by one
	db.insert(initialRenewableSourcesStats);
	



	// GET renewableSourcesStats/loadInitialData

	app.get(BASE_API_URL+"/renewable-sources-stats/loadInitialData", (req, res) => {
		db.insert(initialRenewableSourcesStats);
		res.sendStatus(200);

		console.log("Initial renewable source stats loaded:" + JSON.stringify(initialRenewableSourcesStats, null, 2));
	});


	// GET renewableSourcesStats

	app.get(BASE_API_URL+"/renewable-sources-stats", (req, res) => {

		console.log("New GET .../renewable-sources-stats");

		var query = req.query;
		//console.log("Query: " +  query.year + query.country);
		
		// Casting the String in Integer to compare data in the "find"  query
		// We have to check that the json from the query has the property "year"
		if (query.hasOwnProperty("year")) {
			query.year = parseInt(query.year); 
		}

		// Getting the offset and limit from the url
		var limit = query.limit;
		var offset = query.offset;

		// Removing extra query field of pagination
		delete query.offset;
		delete query.limit;



		// With skip we make the offset and with the limit we limit
		db.find(query).skip(offset).limit(limit).exec((error, renewableSourcesStats) => {
			renewableSourcesStats.forEach((r) => {
				delete r._id;
			});

			res.send(JSON.stringify(renewableSourcesStats, null, 2)); 
			console.log("Data sent: " + JSON.stringify(renewableSourcesStats, null, 2));
		});

		console.log("OK.");
	});




	// POST renewableSourcesStats

	app.post(BASE_API_URL+"/renewable-sources-stats", (req, res) => {

		var newRenewableSourcesStat = req.body;
		//console.log(renewableSourcesStats);


		// We divide the different reasons of badrequest response
		var isEmpty = newRenewableSourcesStat == {};
		
		var haveNullField = (newRenewableSourcesStat.country == null) 
			 || (newRenewableSourcesStat.year == null) 
			 || (newRenewableSourcesStat["percentage-re-total"] == null) 
			 || (newRenewableSourcesStat["percentage-hydropower-total"] == null) 
			 || (newRenewableSourcesStat["percentage-wind-power-total"] == null);

		

		// Or it has extra fields or the fields are not the correct ones, in that cases the fields are wrong
		// This var check if the fields are correct, so we check the opposite in the if
		var rightFields = Object.keys(newRenewableSourcesStat).length == 5 
			&& newRenewableSourcesStat.hasOwnProperty("year") 
			&& newRenewableSourcesStat.hasOwnProperty("country")
			&& newRenewableSourcesStat.hasOwnProperty("percentage-re-total")
			&& newRenewableSourcesStat.hasOwnProperty("percentage-hydropower-total")
			&& newRenewableSourcesStat.hasOwnProperty("percentage-wind-power-total");
		
		
		/* 
		var wrongValues = !(typeof newRenewableSourcesStat.country === 'string')
			|| isNaN(parseInt(newRenewableSourcesStat.year)
			|| isNaN(parseFloat(newRenewableSourcesStat["percentage-re-total"])
			|| isNaN(parseFloat(newRenewableSourcesStat["percentage-hydropower-total"])
			|| isNaN(parseFloat(newRenewableSourcesStat["percentage-wind-power-total"]);
		*/
		
		if(isEmpty || haveNullField || !rightFields) {		
			res.sendStatus(400,"BAD REQUEST");
		} else {
			db.insert(newRenewableSourcesStat);
			
			res.sendStatus(201, "CREATED");
		}
	});


	// DELETE renewableSourcesStats

	app.delete(BASE_API_URL+"/renewable-sources-stats", (req, res) => {	
		db.remove({}, { multi: true }); // Deleting elements one by one
		
		res.sendStatus(200, "OK");
	});


	// PUT renewableSourcesStats

	app.put(BASE_API_URL+"/renewable-sources-stats",(req,res) =>{	
		res.sendStatus(405, "METHOD NOT ALLOWED");

	});



	// GET renewableSourcesStats/XXX

	app.get(BASE_API_URL+"/renewable-sources-stats/:country/:year", (req, res) => {

		var year = req.params.year; 
		var country = req.params.country; 

		var query = {"country": country, "year": parseInt(year)};
		
		db.find(query).exec((error, renewableSourcesStats) => {

			if (renewableSourcesStats.length == 1) {
				delete renewableSourcesStats[0]._id;

				res.send(JSON.stringify(renewableSourcesStats[0], null, 2)); 
				console.log("Data sent: " + JSON.stringify(renewableSourcesStats[0], null, 2));
				
			} else {
				res.sendStatus(404, "NOT FOUND");
			}
			
		});

		console.log("OK.");
		
	});


	// GET renewableSourcesStats/XXX

	app.get(BASE_API_URL+"/renewable-sources-stats/:param", (req, res) => {
		
		var param = req.params.param;
		
		var query = {};
		
		// Checking if we can parse the param, if so, it's a country
		// And the query is just to specify the country
		if (isNaN(parseInt(param))) {
			query = {country: param};
			
		} else {
			query = {year: parseInt(param)};
			
		}

		
		db.find(query).exec((error, renewableSourcesStats) => {

			if (renewableSourcesStats.length > 1) {
				renewableSourcesStats.forEach((r) => {
					delete r._id;
				});

				res.send(JSON.stringify(renewableSourcesStats, null, 2)); 
				console.log("Data sent: " + JSON.stringify(renewableSourcesStats, null, 2));
				
			}
			// We consider the posibility of returning just 1 element and return a JSON and not an array
			
			else if (renewableSourcesStats.length == 1) {
				delete renewableSourcesStats[0]._id;
				
				res.send(JSON.stringify(renewableSourcesStats[0], null, 2)); 
				console.log("Data sent: " + JSON.stringify(renewableSourcesStats[0], null, 2));
				
			}
			
			else {
				res.sendStatus(404, "NOT FOUND");
			}
		});

		console.log("OK.");

	});



	// POST renewableSourcesStats/XXX

	app.post(BASE_API_URL+"/renewable-sources-stats/:country/:year",(req,res) =>{
		res.sendStatus(405, "METHOD NOT ALLOWED");
	});

	app.post(BASE_API_URL+"/renewable-sources-stats/:param",(req,res) =>{
		res.sendStatus(405, "METHOD NOT ALLOWED");
	});



	// PUT renewableSourcesStats/XXX
	app.put(BASE_API_URL+"/renewable-sources-stats/:country/:year", (req,res) =>{

		var params = req.params;
		var year = params.year;
		var country = params.country;

		var body = req.body;

		
		db.update({country: country, year: parseInt(year)}, body, (error, numReplaced) => {
			// Checking if we find match with the query
			if (numReplaced == 0) {
				res.sendStatus(404, "NOT FOUND");
			} else {
				res.sendStatus(200, "OK");
			}
		});

	});

	
	// DELETE renewableSourcesStats/XXX

	app.delete(BASE_API_URL+"/renewable-sources-stats/:country/:year",(req,res) =>{

		var country = req.params.country;
		var year = req.params.year;
		
		var query = {country: country, year: parseInt(year)};
		
		db.remove(query, { multi: true }, (error, numRemoved) => {
			if (numRemoved == 0) {
				res.sendStatus(404, "NOT FOUND");
			} else {
				res.sendStatus(200, "OK");
			}
		}); 
		

	});

	app.delete(BASE_API_URL+"/renewable-sources-stats/:param",(req,res) =>{

		var param = req.params.param;
		
		var query = {};
		
		// Checking if we can parse the param, if so, it's a country
		// And the query is just to specify the country
		if (isNaN(parseInt(param))) {
			query = { country: param };
			
		} else {
			query = { year: parseInt(param) };
			
		}
		
		db.remove(query, { multi: true }, (error, numRemoved) => {
			if (numRemoved == 0) {
				res.sendStatus(404, "NOT FOUND");
			} else {
				res.sendStatus(200, "OK");
			}
		}); 
		
	});

};