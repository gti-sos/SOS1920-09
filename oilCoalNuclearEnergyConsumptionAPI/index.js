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
			"oil-consumption":117.3,
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
	
	//GET oilCoalNuclearEnergyConsumptionStats PERSISTENTE
	app.get(BASE_API_URL + "/oil-coal-nuclear-energy-consumption-stats",(req,res) =>{

		console.log("New GET .../oil-coal-nuclear-energy-consumption-stats");
		
		var query= req.query;
		if(query.hasOwnProperty("year")){
		   query.year= parseInt(query.year);
		   }
		
		var limit = query.limit;
		var offset= query.offset;
		
		//removing field of pagination
		delete query.offset;
		delete query.limit;
		
		db.find(query).skip(offset).limit(limit).exec((error, oil) => {
			oil.forEach((s) => {
					delete s._id;
			});
			res.send(JSON.stringify(oil,null,2));
					console.log("Data sent: " + JSON.stringify((oil,null,2)));
		});
		console.log("OK");
		
	});

	

	//POST oilCoalNuclearEnergyConsumptionStats

		app.post(BASE_API_URL+"/oil-coal-nuclear-energy-consumption-stats",(req,res) =>{

		var newOilCoalNuclearEnergyConsumptionStat = req.body; 
		//console.log(newOilCoalNuclearEnergyConsumptionStat);
		var isempty= newOilCoalNuclearEnergyConsumptionStat == {};
			
			
		var nofield = (newOilCoalNuclearEnergyConsumptionStat.country == null) 
		|| (newOilCoalNuclearEnergyConsumptionStat.year == null)
		|| (newOilCoalNuclearEnergyConsumptionStat["oil-consumption"] == null) 
		|| (newOilCoalNuclearEnergyConsumptionStat["coal-consumption"] == null) 
		|| (newOilCoalNuclearEnergyConsumptionStat["nuclear-energy-consumption"] == null)
		
		
		var rightfield = Object.keys(newOilCoalNuclearEnergyConsumptionStat).length==5
		&& newOilCoalNuclearEnergyConsumptionStat.hasOwnProperty("year") 
		&& newOilCoalNuclearEnergyConsumptionStat.hasOwnProperty("country")
		&& newOilCoalNuclearEnergyConsumptionStat.hasOwnProperty("oil-consumption")
		&& newOilCoalNuclearEnergyConsumptionStat.hasOwnProperty("coal-consumption") 
		&& newOilCoalNuclearEnergyConsumptionStat.hasOwnProperty("nuclear-energy-consumption");
			
	//	var wrongValues = isNaN(parseInt(newOilCoalNuclearEnergyConsumptionStat.year))
	//	|| isNaN(parseInt(newOilCoalNuclearEnergyConsumptionStat.year)
			
		if((isempty || nofield || !rightfield)  ){
			res.sendStatus(400,"BAD REQUEST");
		} 
		else {
		db.insert(newOilCoalNuclearEnergyConsumptionStat);
 			
	
		res.sendStatus(201,"CREATED");
		}
	});

	// DELETE oilCoalNuclearEnergyConsumptionStats




	app.delete(BASE_API_URL+"/oil-coal-nuclear-energy-consumption-stats",(req,res) =>{	
		db.remove({}, {multi:true}); 
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
		var query = {"country": country, "year": parseInt(year)};
		
		
		db.find(query).exec((error, oil) => {
			if(oil.length  == 1){
			   
				delete oil[0]._id;
				
				res.send(JSON.stringify(oil[0],null,2));
				console.log("Data sent: " + JSON.stringify((oil[0],null,2)));
			   
			} else {
				   res.sendStatus(404,"NOT FOUND");
			   }
		});
		
		console.log("OK");
	});

	// GET oilCoalNuclearEnergyConsumptionStats/

	app.get(BASE_API_URL+"/oil-coal-nuclear-energy-consumption-stats/:param", (req,res) =>{

		var param = req.params.param; 
		
		var query = {};
		
		if(isNaN(parseInt(param))){
		   query = {country :param}
		   }else{
			   query = {year: parseInt(param)};
		   
		   }
		
		db.find(query).exec((error, oil) => {
			if(oil.length  > 1){
			   oil.forEach((r) => {
				 delete oil._id;
				  
				 });
				
				res.send(JSON.stringify(oil,null,2));
				console.log("Data sent: " + JSON.stringify((oil,null,2)));
			   
			}	
			else if (oil.length==1){
					delete oil[0]._id;
				res.send(JSON.stringify(oil[0],null,2));
				console.log("Data sent: " + JSON.stringify((oil[0],null,2)));
			}
			else {
				   res.sendStatus(404,"NOT FOUND");
			   }
		});
		
		console.log("OK");
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
		var body = req.body;
	
		db.update({country: country, year: parseInt(year)}, body, (error, numReplaced) => {
			if (numReplaced== 0){
				res.sendStatus(404,"NOT FOUND");
				}else {
					res.sendStatus(200,"OK");
				}
		});
	});



	//  delete oilCoalNuclearEnergyConsumptionStats/XXX


	app.delete(BASE_API_URL+"/oil-coal-nuclear-energy-consumption-stats/:country/:year",(req,res) =>{

		var country = req.params.country;
		var year = req.params.year;
		
		var query = {country: country, year : parseInt(year)};
		
		db.remove(query, {multi:true}, (error, numRemoved) =>{
			if (numRemoved == 0){
			res.sendStatus(404,"NOT FOUND");
			}else {
				res.sendStatus(200,"OK");
			}
		}); 
		
	});

	app.delete(BASE_API_URL+"/oil-coal-nuclear-energy-consumption-stats/:param",(req,res) =>{

		var param = req.params.param;
		var query = {}; 	
		
		if(isNaN(parseInt(param))){
		   query = {country :param}
		   }else{
			   query = {year: parseInt(param)};
		   }
		
			db.remove(query, {multi:true}, (error, numRemoved) =>{
			if (numRemoved == 0){
			res.sendStatus(404,"NOT FOUND");
			}else {
				res.sendStatus(200,"OK");
			}
		}); 
		
		
		
	});
	
	//GET oilCoalNuclearEnergyConsumptionStats

	app.get(BASE_API_URL+"/oil-coal-nuclear-energy-consumption-stats", (req,res) => {
	  res.send(JSON.stringify(oilCoalNuclearEnergyConsumptionStats,null,2));
	});

}