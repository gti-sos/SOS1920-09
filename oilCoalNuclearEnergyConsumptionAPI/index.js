module.exports = function(app) {
	console.log("Energy consumption");
	const dataS= require("nedb");
	const path = 	require("path");
	const dbFileName = path.join(__dirname,"oil_coal_nuclear_energy_consumption.db");
	const BASE_API_URL = "/api/v1";
	const db = new dataS ({
		filename : dbFileName,
		autoload : true
	});

  

	var initialOilCoalNuclearEnergyConsumptionStats = [
		{ 
			"country": "USA",
			"year" : 2016,
			"oil-consumption": 907.6,
			"coal-consumption": 340.6,
			"nuclear-energy-consumption":191.9
		},
		{ 
			"country": "Canada",
			"year" : 2016,
			"oil-consumption": 107.0,
			"coal-consumption":18.9 ,
			"nuclear-energy-consumption": 21.8
		},
		{ 
			"country": "Spain",
			"year" : 2017,
			"oil-consumption": 10.9,
			"coal-consumption":0.1 ,
			"nuclear-energy-consumption": 4.6
		},
		{ 
			"country": "Germany",
			"year" : 2016,
			"oil-consumption": 117.3,
			"coal-consumption":75.8 ,
			"nuclear-energy-consumption": 19.2
		},
		{ 
			"country": "Belgium",
			"year" : 2017,
			"oil-consumption": 32.2,
			"coal-consumption":2.9 ,
			"nuclear-energy-consumption": 9.5
		}
	];

	// ------------------------Ejemplos Ruben--------------------------------------- //


	// RESOURCE oilCoalNuclearEnergyConsumptionStats

	//GET oilCoalNuclearEnergyConsumptionStats

	app.get(BASE_API_URL+"/oil-coal-nuclear-energy-consumption-stats/loadInitialData", (req,res) => {
	  db.insert(initialOilCoalNuclearEnergyConsumptionStats);
		res.sendStatus(200);
		console.log("Initial oil coal nuclear energy consumption loaded:" + JSON.stringify(initialOilCoalNuclearEnergyConsumptionStats,null,2));
	});

	app.get(BASE_API_URL + "/oil-coal-nuclear-energy-consumption-stats",(req,res) =>{

		console.log("New GET .../oil-coal-nuclear-energy-consumption-stats");
		db.find({}, (error, oil) => {
			oil.forEach((s) => {
					delete s._id
			});
			res.send(JSON.stringify(oil,null,2));
					console.log("Data sent: " + JSON.stringify((oil,null,2)));
		});
		console.log("OK");
		
	});

	//GET oilCoalNuclearEnergyConsumptionStats

	app.get(BASE_API_URL+"/oil-coal-nuclear-energy-consumption-stats", (req,res) => {
	  res.send(JSON.stringify(oilCoalNuclearEnergyConsumptionStats,null,2));
	});


	//POST oilCoalNuclearEnergyConsumptionStats

		app.post(BASE_API_URL+"/oil-coal-nuclear-energy-consumption-stats",(req,res) =>{

		var newOilCoalNuclearEnergyConsumptionStat = req.body; 
		//console.log(newOilCoalNuclearEnergyConsumptionStat);

		if((newOilCoalNuclearEnergyConsumptionStat == {}) 
		|| (newOilCoalNuclearEnergyConsumptionStat.country == null) 
		|| (newOilCoalNuclearEnergyConsumptionStat.year == null)
		|| (newOilCoalNuclearEnergyConsumptionStat["oil-consumption"] == null) 
		|| (newOilCoalNuclearEnergyConsumptionStat["coal-consumption"] == null) 
		|| (newOilCoalNuclearEnergyConsumptionStat["nuclear-energy-consumption"] == null)){
			res.sendStatus(400,"BAD REQUEST");
		} else {
			oilCoalNuclearEnergyConsumptionStats.push(newOilCoalNuclearEnergyConsumptionStat); 	
			res.sendStatus(201,"CREATED");
		}
	});

	// DELETE oilCoalNuclearEnergyConsumptionStats




	app.delete(BASE_API_URL+"/oil-coal-nuclear-energy-consumption-stats",(req,res) =>{	
		oilCoalNuclearEnergyConsumptionStats = [];
		res.sendStatus(200, "OK");
		});



	// PUT oilCoalNuclearEnergyConsumptionStats
	app.put(BASE_API_URL+"/oil-coal-nuclear-energy-consumption-stats",(req,res) =>{	
		res.sendStatus(405, "METHOD NOT ALLOWED");

	});


	// GET oilCoalNuclearEnergyConsumptionStats/XXX

	app.get(BASE_API_URL+"/oil-coal-nuclear-energy-consumption-stats/:country/:year", (req,res) =>{

		var year = req.params.year;
		var country = req.params.country;


		var  filteredParam = oilCoalNuclearEnergyConsumptionStats.filter((c) => {
			return (c.year == year) && (c.country == country)
		});

		if( filteredParam.length >= 1) {
			res.send(filteredParam[0]);	
		} else {
			res.sendStatus(404, "NOT FOUND");
		}

	});

	// GET oilCoalNuclearEnergyConsumptionStats/XXX

	app.get(BASE_API_URL+"/oil-coal-nuclear-energy-consumption-stats/:param", (req,res) =>{

		var param = req.params.param; 

		var filteredParam = oilCoalNuclearEnergyConsumptionStats.filter((c) => {
			return (c["year"] == param) || (c["country"] == param);
		});

		if( filteredParam.length >= 1) {
			res.send(filteredParam);	
		} else {
			res.sendStatus(404, "NOT FOUND");
		}

	});





	 //POST oilCoalNuclearEnergyConsumptionStats/XXXX

	app.post(BASE_API_URL+"/oil-coal-nuclear-energy-consumption-stats/:country/:year",(req,res) =>{
		res.sendStatus(405, "METHOD NOT ALLOWED");
	});


	app.post(BASE_API_URL+"/oil-coal-nuclear-energy-consumption-stats/:param",(req,res) =>{
		res.sendStatus(405, "METHOD NOT ALLOWED");
	});


	// PUT oilCoalNuclearEnergyConsumptionStats/XXX
	app.put(BASE_API_URL+"/oil-coal-nuclear-energy-consumption-stats/:country/:year", (req,res) =>{
		var year = req.params.year;
		var country = req.params.country;
		var notFound = oilCoalNuclearEnergyConsumptionStats.filter((r) => {return (r.year == year && r.country == country);}) == 0;
		var body = req.body;

		var updateOilCoalNuclearEnergyConsumptionStats = oilCoalNuclearEnergyConsumptionStats.map((r) => {
			var updatedSourceStat = r;

			if (r.year === year && r.country === country) {
				for (var p in body) {
					updatedSourceStat[p] = body[p];
				}	
			}

			return (updatedSourceStat)

		});

		if (notFound) {
			res.sendStatus(404, "NOT FOUND");
		} else {
			oilCoalNuclearEnergyConsumptionStats = updateOilCoalNuclearEnergyConsumptionStats;
			res.sendStatus(200, "OK");
		}

	});



	//  delete oilCoalNuclearEnergyConsumptionStats/XXX


	app.delete(BASE_API_URL+"/oil-coal-nuclear-energy-consumption-stats/:country/:year",(req,res) =>{

		var country = req.params.country;
		var year = req.params.year;

		var filteredData = oilCoalNuclearEnergyConsumptionStats.filter((r) => {
			return (r.country != country) || (r.year != year);
		});

		if(filteredData.length < oilCoalNuclearEnergyConsumptionStats.length) {
			oilCoalNuclearEnergyConsumptionStats = filteredData;
			res.sendStatus(200, "OK");

		} else {
			res.sendStatus(404, "NOT FOUND");
		}
	});

	app.delete(BASE_API_URL+"/oil-coal-nuclear-energy-consumption-stats/:param",(req,res) =>{

		var param = req.params.param;

		var filteredData = oilCoalNuclearEnergyConsumptionStats.filter((r) => {
			return r["year"] != param && r["country"] != param;
		});

		if(filteredData.length < oilCoalNuclearEnergyConsumptionStats.length) {
			oilCoalNuclearEnergyConsumptionStats = filteredData;
			res.sendStatus(200, "OK");

		} else {
			res.sendStatus(404, "NOT FOUND");
		}
	});
}