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
		"year": "Spain",
		"country": 2016,
		"percentage-re-total": 38.1,
		"percentage-hydropower-total": 14.5,
		"percentage-wind-power-total": 17.8
		
	},
	{ 
		"year": "France",
		"country": 2016,
		"percentage-re-total": 17.5,
		"percentage-hydropower-total": 11.7,
		"percentage-wind-power-total": 3.8
		
	}
];

var oilCoalNuclearEnergyConsumptionStats = [
	{ 
		"year" : 2016,
		"country": "USA",
		"oil-consumption": 907.6,
		"coal-consumption": 340.6,
		"nuclear-energy-consumption":191.9
	},
	{ 
		"year" : 2016,
		"country": "Canada",
		"oil-consumption": 107.0,
		"coal-consumption":19.9 ,
		"nuclear-energy-consumption": 21.8
	}
];

const BASE_API_URL =  "/api/v1";








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


// DELETE CONTACTS

app.delete(BASE_API_URL+"/contacts",(req,res) =>{	
	contacts = [];
	res.sendStatus(200);

});


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







// GET CONTACTS

app.get(BASE_API_URL+"/contacts", (req,res) =>{
	res.send(JSON.stringify(contacts,null,2));
	//console.log("Data sent:"+JSON.stringify(contacts,null,2));
});


// POST CONTACTS

app.post(BASE_API_URL+"/contacts",(req,res) =>{
	
	var newContact = req.body; // Cogemos el body de la request http (que debe tener un contacto en json)
	//console.log(newContact);
	
	if((newContact == {}) || (newContact.name == null)){
		res.sendStatus(400,"BAD REQUEST");
	} else {
		contacts.push(newContact); 	
		res.sendStatus(201,"CREATED");
	}
});

// DELETE CONTACTS

app.delete(BASE_API_URL+"/contacts",(req,res) =>{	
	contacts = [];
	res.sendStatus(200);

});


// GET CONTACTS/XXX

app.get(BASE_API_URL+"/contacts/:name", (req,res) =>{
	
	var name = req.params.name; //params contiene todos los parametros
	
	var filteredContacts = contacts.filter((c) => {
		return (c.name == name)
	});
	
	if(filteredContacts.length >= 1) {
		res.send(filteredContacts[0]);	
	} else {
		res.sendStatus(404, "CONTACT NOT FOUND");
	}
	
});


// PUT CONTACTS/XXX
app.put(BASE_API_URL+"/contacts/:name", (req,res) =>{
		
	var params = req.params;
	var name = params.name;
	
	var body = req.body;
	
	var updatedContacts = contacts.map((c) => {
		var updatedC = c;
		
		if (c.name == name) {
			for (var p in body) {
				updatedC[p] = body[p];
			}	
		}
		
		
		return (updatedC)
		
	});
	
	if (updatedContacts.length == 0) {
		res.sendStatus(404, "CONTACT NOT FOUND");
	} else {
		contacts = updatedContacts;
		res.sendStatus(200, "OK");
	}
	
});

// DELETE CONTACTS/XXX
app.delete(BASE_API_URL+"/contacts/:name",(req,res) =>{
	
	var name = req.params.name; //params contiene todos los parametros
	
	var filteredContacts = contacts.filter((c) => {
		return (c.name != name)
	});
	
	if(filteredContacts.length < contacts.length) {
		contacts = filteredContacts;
		res.sendStatus(200);
		
	} else {
		res.sendStatus(404, "CONTACT NOT FOUND");
	}
});



app.listen(port, () => {
	console.log("Server ready");
});

console.log("Starting server...");