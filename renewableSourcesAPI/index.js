module.exports = function (app) {
	console.log("Registering renewable source stats API...");
	const dataStore = require("nedb");
	const path = require("path");
	const dbFileName = path.join(__dirname, "renewable_sources_stats.db");
	const BASE_API_URL = "/api/v1";
	
	const db = new dataStore({
		filename: dbFileName,
		autoload: true
	});
	
	
	
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

		}
		
	];
	
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
		//console.log(query);
		
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




		if((newRenewableSourcesStat == {}) 
			 || (newRenewableSourcesStat.country == null) 
			 || (newRenewableSourcesStat.year == null) 
			 || (newRenewableSourcesStat["percentage-re-total"] == null) 
			 || (newRenewableSourcesStat["percentage-hydropower-total"] == null) 
			 || (newRenewableSourcesStat["percentage-wind-power-total"] == null)) {		
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