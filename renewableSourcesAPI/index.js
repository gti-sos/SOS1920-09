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

		}
	];
	
	// GET renewableSourcesStats/loadInitialData

app.get(BASE_API_URL+"/renewable-sources-stats/loadInitialData", (req,res) =>{
	db.insert(initialRenewableSourcesStats);
	res.sendStatus(200);
	
	console.log("Initial renewable source stats loaded:" + JSON.stringify(initialRenewableSourcesStats, null, 2));
});


// GET renewableSourcesStats

app.get(BASE_API_URL+"/renewable-sources-stats", (req,res) =>{
	
	console.log("New GET .../renewable-sources-stats");
	
	db.find({}, (error, renewableSourcesStats) => {
		renewableSourcesStats.forEach((r) => {
			delete c._id
			
			res.send(JSON.stringify(renewableSourcesStats, null, 2)); 
			console.log("Data sent: " + JSON.stringify(renewableSourcesStats, null, 2));

		});
	});
	
	console.log("OK.");
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



// PUT renewableSourcesStats/XXX
app.put(BASE_API_URL+"/renewable-sources-stats/:country/:year", (req,res) =>{
		
	var params = req.params;
	var year = params.year;
	var country = params.country;
	
	var body = req.body;
	
	var notFound = renewableSourcesStats.filter((r) => {return (r.year == year && r.country == country);}) == 0;
	
	var updatedRenewableSourcesStats = renewableSourcesStats.map((r) => {
		var updatedSourceStat = r;

		if (r.year == year && r.country == country) {
			for (var p in body) {
				updatedSourceStat[p] = body[p];
			}	

		}

		return (updatedSourceStat)
		
	});
	
	if (notFound) {
		res.sendStatus(404, "NOT FOUND");
	} else {
		renewableSourcesStats = updatedRenewableSourcesStats;
		res.sendStatus(200, "OK");
	}
	
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

}