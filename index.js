// Llamamos a los modulos
const express = require("express");
const bodyParser = require("body-parser");

var app = express();

app.use(bodyParser.json()); // todo lo que te llega a la api lo traduce a json automaticamente

var port = process.env.PORT || 80;

var plugInVehiclesStats = [
	{ 
		name: "peter",
		phone: 123456	
	},
	{ 
		name: "pablo",
		phone: 789456	
	}
];

var renewableSourcesStats = [
	{ 
		name: "peter",
		phone: 123456	
	},
	{ 
		name: "pablo",
		phone: 789456	
	}
];

var oilCoalNuclearEnergyConsumptionStats = [
	{ 
		name: "peter",
		phone: 123456	
	},
	{ 
		name: "pablo",
		phone: 789456	
	}
];

const BASE_API_URL =  "/api/v1";

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