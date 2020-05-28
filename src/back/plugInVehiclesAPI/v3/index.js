module.exports = function (app){
	console.log("Registering plugin vehicles stats...");
	const dataStore = require("nedb");
	const path = require("path");
	const dbFileName = path.join(__dirname, "plugin_vehicles_stats.db");
	const BASE_API_URL = "/api/v3";

	const request = require('request');
	const express = require("express");

	var api01 = 'https://sos1920-01.herokuapp.com'; // Integración mediante proxy grupo 01
	var paths01='/api/v2/emigrants-stats';

	var api05 = 'https://sos1920-05.herokuapp.com'; // Integración mediante proxy grupo 05
	var paths05='/api/v1/life_expectancies';

	var api06 = 'https://sos1920-06.herokuapp.com'; // Integración mediante proxy grupo 06
	var paths06='/api/v1/not-hospitalized-stats';

	var api08 = 'https://sos1920-08.herokuapp.com'; // Integración mediante proxy grupo 08
	var paths08='/api/v1/electricity-produced-stats';

	var api28 = 'https://sos1920-28.herokuapp.com'; // Integración mediante proxy grupo 28
	var paths28='/api/v1/gce';

	var apiExt01 = 'https://api.spacexdata.com'; // Integración mediante proxy external api 01
	var pathsExt01='/v3/launches';

	
	
	const db = new dataStore({
		filename: dbFileName,
		autoload: true
	});

	// Integración mediante proxy Api 01
	app.use(paths01, function(req, res) {
        var url = api01 + req.baseUrl + req.url;
        console.log('piped: ' + req.baseUrl + req.url);
        req.pipe(request(url)).pipe(res);
	});

	// Integración mediante proxy Api 05
	app.use(paths05, function(req, res) {
        var url = api05 + req.baseUrl + req.url;
        console.log('piped: ' + req.baseUrl + req.url);
        req.pipe(request(url)).pipe(res);
	});

	// Integración mediante proxy Api 06
	app.use(paths06, function(req, res) {
        var url = api06 + req.baseUrl + req.url;
        console.log('piped: ' + req.baseUrl + req.url);
        req.pipe(request(url)).pipe(res);
	});

	// Integración mediante proxy Api 08
	app.use(paths08, function(req, res) {
        var url = api08 + req.baseUrl + req.url;
        console.log('piped: ' + req.baseUrl + req.url);
        req.pipe(request(url)).pipe(res);
	});

	// Integración mediante proxy Api 28
	app.use(paths28, function(req, res) {
        var url = api28 + req.baseUrl + req.url;
        console.log('piped: ' + req.baseUrl + req.url);
        req.pipe(request(url)).pipe(res);
	});

	// Integración mediante proxy External API 01
	app.use(pathsExt01, function(req, res) {
        var url = apiExt01 + req.baseUrl + req.url;
        console.log('piped: ' + req.baseUrl + req.url);
        req.pipe(request(url)).pipe(res);
	});


    app.use(express.static('.'));

	var initialPlugInVehiclesStats = [
		{ 
			"country": "Canada",
			"year": 2018,
			"pev-stock": 81435,
			"annual-sale": 33879,
			"cars-per-1000": 2.2
		},
		{ 
			"country": "China",
			"year": 2018,
			"pev-stock": 2243772,
			"annual-sale": 1016002,
			"cars-per-1000": 1.6
		},
		{ 
			"country": "France",
			"year": 2018,
			"pev-stock": 204617,
			"annual-sale": 53745,
			"cars-per-1000": 3.1
		},
		{ 
			"country": "Germany",
			"year": 2018,
			"pev-stock": 196750,
			"annual-sale": 67504,
			"cars-per-1000": 2.4
		},
		{ 
			"country": "Japan",
			"year": 2018,
			"pev-stock": 257363,
			"annual-sale": 52013,
			"cars-per-1000": 2.0
		},
		{ 
			"country": "Netherlands",
			"year": 2018,
			"pev-stock": 145882,
			"annual-sale": 29187,
			"cars-per-1000": 8.4
		},
		{ 
			"country": "Norway",
			"year": 2018,
			"pev-stock": 296215,
			"annual-sale": 86290,
			"cars-per-1000": 55.9
		},
		{ 
			"country": "Spain",
			"year": 2018,
			"pev-stock": 155495 ,
			"annual-sale": 26922,
			"cars-per-1000": 2.8
		},
		{ 
			"country": "Sweden",
			"year": 2018,
			"pev-stock": 79579,
			"annual-sale": 29909,
			"cars-per-1000": 7.8
		},
		{ 
			"country": "UK",
			"year": 2018,
			"pev-stock": 197000,
			"annual-sale": 59911,
			"cars-per-1000": 3.2
		},
		{ 
			"country": "USA",
			"year": 2018,
			"pev-stock": 1126000,
			"annual-sale": 361307,
			"cars-per-1000": 3.4
		},
		{ 
			"country": "USA",
			"year": 2017,
			"pev-stock": 764666,
			"annual-sale": 199818,
			"cars-per-1000": 2.9
		}
		
	];

	db.remove({}, {multi:true});
	db.insert(initialPlugInVehiclesStats);

	// RESOURCE plugInVehiclesStats

	// GET plugInVehiclesStats/loadInitialData

	app.get(BASE_API_URL+"/plugin-vehicles-stats/loadInitialData", (req,res) =>{

		db.insert(initialPlugInVehiclesStats);
		res.sendStatus(200);

		console.log("Initial plugin vehicles stats loaded:" + JSON.stringify(initialPlugInVehiclesStats, null, 2));

	});

	// GET plugInVehiclesStats

	app.get(BASE_API_URL+"/plugin-vehicles-stats", (req,res) =>{

		console.log("New GET .../plugin-vehicles-stats");
		
		var query = req.query;
		//We have to check that the json from the query
		if(query.hasOwnProperty("year")){
			query.year = parseInt(query.year); //Casting the String in Integer to compare data in the "find" query
		}
		
		//
		var limit = query.limit;
		var offset = query.offset;
		
		//
		delete query.limit;
		delete query.offset;

		db.find(query).skip(offset).limit(limit).exec((error, plugInVehiclesStats) => {
			plugInVehiclesStats.forEach((p) => {
				delete p._id;
			
			});
			
		res.send(JSON.stringify(plugInVehiclesStats,null,2));
		console.log("Data send:" + JSON.stringify(plugInVehiclesStats, null, 2));
			
	});

		console.log("Ok.");
		
	});

	// POST plugInVehiclesStats

	app.post(BASE_API_URL+"/plugin-vehicles-stats",(req,res) =>{

		var newPlugInVehiclesStat = req.body;
		
		var isEmpty = newPlugInVehiclesStat == {};
		
		var haveNullField = (newPlugInVehiclesStat.country == null) 
			|| (newPlugInVehiclesStat.year == null) 
			|| (newPlugInVehiclesStat["pev-stock"] == null) 
			|| (newPlugInVehiclesStat["annual-sale"] == null) 
			|| (newPlugInVehiclesStat["cars-per-1000"]== null);
		
		 // Or it has extra fields or the fields are not the correct ones
		
		var rightFields = Object.keys(newPlugInVehiclesStat).length == 5
			&& newPlugInVehiclesStat.hasOwnProperty("country") 
			&& newPlugInVehiclesStat.hasOwnProperty("year") 
			&& newPlugInVehiclesStat.hasOwnProperty("pev-stock") 
			&& newPlugInVehiclesStat.hasOwnProperty("annual-sale") 
			&& newPlugInVehiclesStat.hasOwnProperty("cars-per-1000");

		if(isEmpty || haveNullField || !rightFields){
			res.sendStatus(400,"BAD REQUEST");
		}
		else {
			db.insert(newPlugInVehiclesStat);	
			res.sendStatus(201,"CREATED");
		}
	}); 

	// DELETE plugInVehiclesStats

	app.delete(BASE_API_URL+"/plugin-vehicles-stats",(req,res) =>{	
		db.remove({}, { multi: true }); // Deleting elements one by one
		
		
		res.sendStatus(200, "OK");
	});

	// PUT plugInVehiclesStats

	app.put(BASE_API_URL+ "/plugin-vehicles-stats",(req,res) =>{	
		res.sendStatus(405, "METHOD NOT ALLOWED");
	});

	// GET plugInVehiclesStats/XXX

	app.get(BASE_API_URL+"/plugin-vehicles-stats/:country/:year", (req,res) =>{

		var country = req.params.country;
		var year = req.params.year;
		
		var query = {"country": country, "year": parseInt(year)};

		db.find(query).exec((error, plugInVehiclesStats) => {
			
			if(plugInVehiclesStats.length == 1) {
				delete plugInVehiclesStats[0]._id;
				
				res.send(JSON.stringify(plugInVehiclesStats[0], null, 2));
				console.log("Data sent: " + JSON.stringify(plugInVehiclesStats[0], null, 2));
			}
			else {
				res.sendStatus(404, "NOT FOUND");
			}
		});
		
		console.log("OK.");
	});
	

	// GET plugInVehiclesStats/XXX

	app.get(BASE_API_URL+"/plugin-vehicles-stats/:param", (req,res) =>{

		var param = req.params.param;
		
		var query = {};
		
		// Checking if we can parse the param, if so, it's a country
		// And the query is just to specify the country
		if(isNaN(parseInt(param))){
			var query = {country: param};
		} 
		else {
			query = {year: parseInt(param)};
		}
		

		db.find(query).exec((error, plugInVehiclesStats) => {
			
			if(plugInVehiclesStats.length > 1) {
				plugInVehiclesStats.forEach((r) => {
					delete r._id;
				});
				
				
				res.send(JSON.stringify(plugInVehiclesStats, null, 2));
				console.log("Data sent: " + JSON.stringify(plugInVehiclesStats[0], null, 2));
			}
			
			// We consider the posibility of returning just 1 element and return a JSON and not an array
			else if (plugInVehiclesStats.length == 1){
				delete plugInVehiclesStats[0]._id;
				
				res.send(JSON.stringify(plugInVehiclesStats[0], null, 2));
				console.log("Data sent: " + JSON.stringify(plugInVehiclesStats[0], null, 2));
			}
			
			else {
				res.sendStatus(404, "NOT FOUND");
			}
		});
		
		console.log("OK.");
		
	});
	

	// POST plugInVehiclesStats/XXX

	app.post(BASE_API_URL+"/plugin-vehicles-stats/:country/:year",(req,res) =>{
		res.sendStatus(405, "METHOD NOT ALLOWED");
	});

	app.post(BASE_API_URL+"/plugin-vehicles-stats/:param",(req,res) =>{
		res.sendStatus(405, "METHOD NOT ALLOWED");
	});
	

	// DELETE plugInVehiclesStats/XXX

	app.delete(BASE_API_URL+"/plugin-vehicles-stats/:country/:year",(req,res) =>{

		var country = req.params.country;
		var year = req.params.year;
		
		var query = {country: country, year: parseInt(year)};
		
		db.remove(query, {multi: true}, (error, numRemoved) => {
			
			if (numRemoved == 0){
				res.sendStatus(404, "NOT FOUND");
			}
			else{
				res.sendStatus(200, "OK");
			}
		});
	});

	
	
	app.delete(BASE_API_URL+"/plugin-vehicles-stats/:param",(req,res) =>{

		var param = req.params.param;
		
		var query = {};

		if(isNaN(parseInt(param))){
			 query = {country: param};
		} 
		else {
			query = {year: parseInt(param)};
		}
		
		db.remove(query, { multi: true}, (error, numRemoved) => {
			if(numRemoved == 0){
				res.sendStatus(404, "NOT FOUND");
			}
			else{
				res.sendStatus(200, "OK");
			}
		});
			
		});
	

	// PUT plugInVehiclesStats/XXX
	app.put(BASE_API_URL+"/plugin-vehicles-stats/:country/:year", (req,res) =>{

		
		var country = req.params.country;
		var year = req.params.year;
		var body = req.body;
		
		db.update({country: country, year: parseInt(year)}, body, (error, numReplaced) => {
			
			//Checking if we find match with the query
			if (numReplaced == 0){
				res.sendStatus(404, "NOT FOUND");
		} else {
			res.sendStatus(200, "OK");
			}
		});
	});
};