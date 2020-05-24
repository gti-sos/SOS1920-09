module.exports = function (app) {
	/* Lodash helps us with the deepCopy */
	var _ = require('lodash');
	// For JWT auth
	var jwt = require('jsonwebtoken');
	var bodyParser = require('body-parser');
	console.log("Registering renewable source stats API...");
	const dataStore = require("lokijs");
	const path = require("path");
	const dbFileName = path.join(__dirname, "renewable_sources_stats.db");
	const BASE_API_URL = "/api/v3";
	
	const db = new dataStore(dbFileName);
	
	var initialData = [
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

		}];
	
		// Login for the JWT auth
	app.use(bodyParser.urlencoded({extended: false}))
	app.use(bodyParser.json({limit:'10mb'}))

	app.post(BASE_API_URL+'/renewable-sources-stats/login', (req, res) => {
		var username = req.body.user
		var password = req.body.password
	  
		if( !(username === 'test' && password === 'test')){
		  res.status(401).send({
			error: 'usuario o contraseña inválidos'
		  })
		  return
		}
	  
		var tokenData = {
		  username: username
		  // ANY DATA
		}
	  
		var token = jwt.sign(tokenData, 'Secret Password', {
		   expiresIn: 60 * 60 * 24 // expires in 24 hours
		})
	  
		res.send({
		  token
		})
	  });

	// Securized site
	app.get(BASE_API_URL+'/renewable-sources-stats/secure', (req, res) => {
		var token = req.headers['authorization']
		if(!token){
			res.status(401).send({
			  error: "Es necesario el token de autenticación"
			})
			return
		}
	
		token = token.replace('Bearer ', '')
	
		jwt.verify(token, 'Secret Password', function(err, user) {
		  if (err) {
			res.status(401).send({
			  error: 'Token inválido'
			})
		  } else {
			res.send({
			  message: 'Awwwww yeah!!!!'
			})
		  }
		})
	});


	/* Adding the element 1 by one because a lokijs problem, that in loadInitial said document already added */
	initialData.forEach((d) => { db.addCollection('stats').insert(_.cloneDeep(d)); });
	
	db.saveDatabase();

	app.get(BASE_API_URL+"/renewable-sources-stats/loadInitialData", (req, res) => {
		db.removeCollection('stats'); 
		db.saveDatabase();
		initialData.forEach((d) => {  db.addCollection('stats').insert(_.cloneDeep(d)); });
		db.saveDatabase();
		res.sendStatus(200);

		console.log("Initial renewable source stats loaded");
	});


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

		// With offset we make the offset and with the limit we limit

		var data = db.addCollection('stats').chain().find(query).limit(limit).offset(offset).data();
		/* Using clone deep to preserve meta, not enought shallow copy */
		var results = _.cloneDeep(data);

		results.forEach((d) => {
			delete d.meta;
			delete d["$loki"];
		});
		
		res.send(JSON.stringify(results, null, 2)); 
		console.log("OK.");

		//console.log(results);
		//console.log(db.addCollection('stats').chain().find(query).limit(limit).offset(offset).data());
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
			db.addCollection('stats').insert(newRenewableSourcesStat);
			db.saveDatabase();
			
			res.sendStatus(201, "CREATED");
		}
	});

	
	// DELETE renewableSourcesStats

	app.delete(BASE_API_URL+"/renewable-sources-stats", (req, res) => {	
		db.removeCollection('stats');
		db.addCollection('stats');
		db.saveDatabase();
		// stats.chain().remove(); 
		// stats.chain().remove(); /* Twice because a lokijs problem, one it is not enought */
		

		if (db.addCollection('stats').find().length == 0) {
			res.sendStatus(200, "OK");
		} else {
			res.sendStatus(400, "BAD REQUEST");
		}
		
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
		
		// With offset we make the offset and with the limit we limit
		var results = _.cloneDeep(db.addCollection('stats').find(query));

		if (results.length == 1) {
			delete results[0].meta;
			delete results[0]["$loki"];

			res.send(JSON.stringify(results[0], null, 2)); 
			console.log("Data sent: " + JSON.stringify(results[0], null, 2));
			
		} else {
			res.sendStatus(404, "NOT FOUND");
		}		
		res.send(JSON.stringify(results, null, 2));


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

		var results = _.cloneDeep(db.addCollection('stats').find(query));


		if (results.length > 1) {
			results.forEach((r) => {
				delete r.meta;
				delete r["$loki"];
			});

			res.send(JSON.stringify(results, null, 2)); 
			console.log("Data sent: " + JSON.stringify(results, null, 2));
			
		}
		// We consider the posibility of returning just 1 element and return a JSON and not an array
			
		else if (results.length == 1) {
			delete results[0].meta;
			delete results[0]["$loki"];

			
			res.send(JSON.stringify(results[0], null, 2)); 
			console.log("Data sent: " + JSON.stringify(results[0], null, 2));
			
		}
			
		else {
			res.sendStatus(404, "NOT FOUND");
		}

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

		var query = {country: country, year: parseInt(year)};		
		var beforeRemoving = db.addCollection('stats').find(query);

		if (beforeRemoving.length == 0) {
			res.sendStatus(404, "NOT FOUND");
		} else {
			 /* 
			 We had some problems with the remove function, so we remove the entire collection and 
			 add the elements not removed
			 */
			var results = db.addCollection('stats').where((d) => {
				return d.country != country || d.year != parseInt(year) ;
			});
			
			var r = db.addCollection('stats').find(query)[0];
			
			r["percentage-re-total"] = body["percentage-re-total"];
			r["percentage-hydropower-total"] = body["percentage-hydropower-total"];
			r["percentage-wind-power-total"] = body["percentage-wind-power-total"];
			console.log(r);

			db.addCollection('stats').update(r);
			res.sendStatus(200, "OK");


		}

	}); 


	
	// DELETE renewableSourcesStats/XXX

	app.delete(BASE_API_URL+"/renewable-sources-stats/:country/:year",(req,res) =>{

		var country = req.params.country;
		var year = req.params.year;
		
		var query = {country: country, year: parseInt(year)};
		var beforeRemoving = db.addCollection('stats').find(query);

		if (beforeRemoving.length == 0) {
			res.sendStatus(404, "NOT FOUND");
		} else {
			 /* 
			 We had some problems with the remove function, so we remove the entire collection and 
			 add the elements not removed
			 */

			var r = db.addCollection('stats').find(query)[0];
			
			console.log(r);
			db.addCollection('stats').remove(r);
		

			
			db.saveDatabase();		
			
			var searchDeletedData = db.addCollection('stats').find(query);

			res.sendStatus(200, "OK");

			
		}
		

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

		
		
		var beforeRemoving = db.addCollection('stats').find(query);

		if (beforeRemoving.length == 0) {
			res.sendStatus(404, "NOT FOUND");
		} else if (beforeRemoving.length == 1) {

	
			
			var r = db.addCollection('stats').find(query)[0];
			
			console.log(r);
			db.addCollection('stats').remove(r);

			res.sendStatus(200, "OK");
		
		} else {
			for (let i = 0; i < beforeRemoving.length; i++) {
				
				
				var r = db.addCollection('stats').find(query)[0];
				
				console.log(r);
				db.addCollection('stats').remove(r);

				res.sendStatus(200, "OK");
			}
		}
		
	});





};