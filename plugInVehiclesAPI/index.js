module.exports = function (app){
	console.log("Registering plugin vehicles stats...");
	const dataStore = require("nedb");
	const path = require("path");
	const dbFileName = path.join(__dirname, "plugin_vehicles_stats.db");
	const BASE_API_URL = "/api/v1";
	const db = new dataStore({
		filename: dbFileName,
		autoload: true
	});


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
			"country": "USA",
			"year": 2018,
			"pev-stock": 1126000,
			"annual-sale": 361307,
			"cars-per-1000": 3.4
		}
		
	];
	
	db.remove({}, { multi: true });
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