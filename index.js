// We call the modules
const express = require("express");
const bodyParser = require("body-parser");
const path = require("path"); 
const plugInVehiclesAPI = require(path.join(__dirname, "plugInVehiclesAPI/front"));
const renewableSourcesAPI = require(path.join(__dirname, "renewableSourcesAPI/front"));
const oilCoalNuclearEnergyConsumptionAPI = require(path.join(__dirname, "oilCoalNuclearEnergyConsumptionAPI/front"));

const port = process.env.PORT || 80;

const app = express();

app.use(bodyParser.json());

plugInVehiclesAPI(app);
renewableSourcesAPI(app);
oilCoalNuclearEnergyConsumptionAPI(app);

app.listen(port, () => {
	console.log("Server ready");
});


console.log("Starting server...");
