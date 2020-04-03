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
			"year": "2018",
			"pev-stock": 81435,
			"annual-sale": 33879,
			"cars-per-1000": 2.2
		},
		{ 
			"country": "China",
			"year": "2018",
			"pev-stock": 2243772,
			"annual-sale": 1016002,
			"cars-per-1000": 1.6
		},
		{ 
			"country": "France",
			"year": "2018",
			"pev-stock": 204617,
			"annual-sale": 53745,
			"cars-per-1000": 3.1
		},
		{ 
			"country": "Germany",
			"year": "2018",
			"pev-stock": 196750,
			"annual-sale": 67504,
			"cars-per-1000": 2.4
		},
		{ 
			"country": "USA",
			"year": "2018",
			"pev-stock": 1126000,
			"annual-sale": 361307,
			"cars-per-1000": 3.4
		}
		
	];

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
		
		//
		var limit = query.limit;
		var offset = query.offset;
		
		//
		delete query.limit;
		delete query.offset;

		db.find(query).skip(offset).limit(limit).exec((error, plugInVehiclesStats) => {
			plugInVehiclesStats.forEach((p) => {
				delete p._id
			
			});
			
		res.send(JSON.stringify(plugInVehiclesStats,null,2));
		console.log("Data send:" + JSON.stringify(plugInVehiclesStats, null, 2));
			
	});

		console.log("Ok.");
		
	});

	// POST plugInVehiclesStats

	app.post(BASE_API_URL+"/plugin-vehicles-stats",(req,res) =>{

		var newPlugInVehiclesStat = req.body; 

		if((newPlugInVehiclesStat == {}) 
		|| (newPlugInVehiclesStat.country == null) 
		|| (newPlugInVehiclesStat.year == null) 
		|| (newPlugInVehiclesStat["pev-stock"] == null) 
		|| (newPlugInVehiclesStat["annual-sale"] == null) 
		|| (newPlugInVehiclesStat["cars-per-1000"]== null) ) {

			res.sendStatus(400,"BAD REQUEST");
		} 
		else {
			plugInVehiclesStats.push(newPlugInVehiclesStat); 	
			res.sendStatus(201,"CREATED");
		}
	}); 

	// DELETE plugInVehiclesStats

	app.delete(BASE_API_URL+"/plugin-vehicles-stats",(req,res) =>{	
		plugInVehiclesStats = [];
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

		var filteredData = plugInVehiclesStats.filter((r) => {
			return  (r.country == country) && (r.year == year);
		});

		if(filteredData.length >= 1) {
			res.send(filteredData[0]);	
		} else {
			res.sendStatus(404, "NOT FOUND");
		}
	});

	// GET plugInVehiclesStats/XXX

	app.get(BASE_API_URL+"/plugin-vehicles-stats/:param", (req,res) =>{

		var param = req.params.param; 

		var filteredData = plugInVehiclesStats.filter((r) => {
			return (r["year"] == param) || (r["country"] == param);
		});

		if(filteredData.length >= 1) {
			res.send(filteredData);	
		} else {
			res.sendStatus(404, "NOT FOUND");
		}
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

		var filteredData = plugInVehiclesStats.filter((c) => {
			return (c.country != country) || (c.year != year);
		});

		if(filteredData.length < plugInVehiclesStats.length) {
			plugInVehiclesStats = filteredData;
			res.sendStatus(200, "OK");

		} else {
			res.sendStatus(404, "NOT FOUND");
		}
	});

	app.delete(BASE_API_URL+"/plugin-vehicles-stats/:param",(req,res) =>{

		var param = req.params.param;

		var filteredData = plugInVehiclesStats.filter((r) => {
			return r["year"] != param && r["country"] != param;
		});

		if(filteredData.length < plugInVehiclesStats.length) {
			plugInVehiclesStats = filteredData;
			res.sendStatus(200, "OK");

		} else {
			res.sendStatus(404, "NOT FOUND");
		}
	});

	// PUT plugInVehiclesStats/XXX
	app.put(BASE_API_URL+"/plugin-vehicles-stats/:country/:year", (req,res) =>{

		var country = req.params.country;
		var year = req.params.year;
		var notFound = plugInVehiclesStats.filter((r) => {return (r.year == year && r.country == country);}) == 0;
		var body = req.body;

		var updatedData = plugInVehiclesStats.map((c) => {
			var updatedD = c;
			if (c.country == country && c.year == year) {
				for (var p in body) {
					updatedD[p] = body[p];
				}	
			}
			return (updatedD)
		});

		if (notFound) {
			res.sendStatus(404, "NOT FOUND");
		} else {
			plugInVehiclesStats = updatedData;
			res.sendStatus(200, "OK");
		}
	});
};