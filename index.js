// Llamamos a los modulos
const express = require("express");
const bodyParser = require("body-parser");

var app = express();

app.use(bodyParser.json()); // todo lo que te llega a la api lo traduce a json automaticamente

var port = process.env.PORT || 80;

var plugInVehiclesStats = [
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
	}
];

var renewableSourcesStats = [
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
		
	}
];

var oilCoalNuclearEnergyConsumptionStats = [
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
		"coal-consumption":19.9 ,
		"nuclear-energy-consumption": 21.8
	}
];

const BASE_API_URL =  "/api/v1";


// --------------------------------------------------------------- //






// RESOURCE plugInVehiclesStats

// GET plugInVehiclesStats

app.get(BASE_API_URL+"/plugin-vehicles-stats", (req,res) =>{
	res.send(JSON.stringify(plugInVehiclesStats,null,2));
	//console.log("Data sent:"+JSON.stringify(contacts,null,2));
});

// POST plugInVehiclesStats

app.post(BASE_API_URL+"/plugin-vehicles-stats",(req,res) =>{
	
	var newPlugInVehiclesStat = req.body; 
	//console.log(newPlugInVehiclesStats);
	
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
	
	if (updatedData.length == 0) {
		res.sendStatus(404, "NOT FOUND");
	} else {
		plugInVehiclesStats = updatedData;
		res.sendStatus(200, "OK");
	}
});


// --------------------------------------------------------------- //

// RESOURCE renewableSourcesStats

// GET renewableSourcesStats

app.get(BASE_API_URL+"/renewable-sources-stats", (req,res) =>{
	res.send(JSON.stringify(renewableSourcesStats, null, 2)); 
	//console.log("Data sent:"+JSON.stringify(renewableSourcesStats, null, 2));
});



// POST renewableSourcesStats

app.post(BASE_API_URL+"/renewable-sources-stats",(req,res) =>{
	
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
		renewableSourcesStats.push(newRenewableSourcesStat); 	
		res.sendStatus(201,"CREATED");
	}
});


// DELETE renewableSourcesStats

app.delete(BASE_API_URL+"/renewable-sources-stats",(req,res) =>{	
	renewableSourcesStats = [];
	res.sendStatus(200, "OK");

});


// PUT renewableSourcesStats

app.put(BASE_API_URL+"/renewable-sources-stats",(req,res) =>{	
	res.sendStatus(405, "METHOD NOT ALLOWED");

});



// GET renewableSourcesStats/XXX

app.get(BASE_API_URL+"/renewable-sources-stats/:country/:year", (req,res) =>{
	
	var year = req.params.year; 
    var country = req.params.country; 
	
    
	var filteredData = renewableSourcesStats.filter((r) => {
		return (r.country == country) && (r.year == year);
	});
    
	
	if(filteredData.length >= 1) {
		res.send(filteredData[0]);	
	} else {
		res.sendStatus(404, "NOT FOUND");
	}
	
});


// GET renewableSourcesStats/XXX

app.get(BASE_API_URL+"/renewable-sources-stats/:param", (req,res) =>{
	
	var param = req.params.param; 
	
	var filteredData = renewableSourcesStats.filter((r) => {
		return (r["year"] == param) || (r["country"] == param);
	});
	
    
	if(filteredData.length >= 1) {
		res.send(filteredData);	
	} else {
		res.sendStatus(404, "NOT FOUND");
	}
	
});



// POST renewableSourcesStats/XXX

app.post(BASE_API_URL+"/renewable-sources-stats/:country/:year",(req,res) =>{
	res.sendStatus(405, "METHOD NOT ALLOWED");
});

app.post(BASE_API_URL+"/renewable-sources-stats/:param",(req,res) =>{
	res.sendStatus(405, "METHOD NOT ALLOWED");
});

// DELETE renewableSourcesStats/XXX

app.delete(BASE_API_URL+"/renewable-sources-stats/:country/:year",(req,res) =>{
	
	var country = req.params.country;
	var year = req.params.year;
	
	var filteredData = renewableSourcesStats.filter((r) => {
		return (r.country != country) || (r.year != year);
	});
	
	if(filteredData.length < renewableSourcesStats.length) {
		renewableSourcesStats = filteredData;
		res.sendStatus(200, "OK");
		
	} else {
		res.sendStatus(404, "NOT FOUND");
	}
});

// PUT renewableSourcesStats/XXX
app.put(BASE_API_URL+"/renewable-sources-stats/:country/:year", (req,res) =>{
		
	var params = req.params;
	var year = params.year;
	var country = params.country;
	
	var body = req.body;
	
	var updatedRenewableSourcesStats = renewableSourcesStats.map((r) => {
		var updatedSourceStat = r;
		
		if (r.year === year && r.country === country) {
			for (var p in body) {
				updatedSourceStat[p] = body[p];
			}	
		}
		
		return (updatedSourceStat)
		
	});
	
	if (updatedRenewableSourcesStats.length === 0) {
		res.sendStatus(404, "NOT FOUND");
	} else {
		renewableSourcesStats = updatedRenewableSourcesStats;
		res.sendStatus(200, "OK");
	}
	
});

app.delete(BASE_API_URL+"/renewable-sources-stats/:param",(req,res) =>{
	
	var param = req.params.param;
	
	var filteredData = renewableSourcesStats.filter((r) => {
		return r["year"] != param && r["country"] != param;
	});
	
	if(filteredData.length < renewableSourcesStats.length) {
		renewableSourcesStats = filteredData;
		res.sendStatus(200, "OK");
		
	} else {
		res.sendStatus(404, "NOT FOUND");
	}
});




// ------------------------Ejemplos Ruben--------------------------------------- //


// RESOURCE oilCoalNuclearEnergyConsumptionStats

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

app.delete(BASE_API_URL+"/oil-coal-nuclear-energy-consumption-stats",(req,res) =>{	
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
	
	if (updateOilCoalNuclearEnergyConsumptionStats.length === 0) {
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





// --------------------------------------------------------------- //



app.listen(port, () => {
	console.log("Server ready");
});

