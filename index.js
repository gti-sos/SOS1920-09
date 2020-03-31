// Llamamos a los modulos
const express = require("express");
const bodyParser = require("body-parser");
const path = require("path"); // No es necesario hacer npminstall
const plugInVehiclesAPI = require(path.join(__dirname, "plugInVehiclesAPI"));
const renewableSourcesAPI = require(path.join(__dirname, "renewableSourcesAPI"));
const oilCoalNuclearEnergyConsumptionAPI = require(path.join(__dirname, "oilCoalNuclearEnergyConsumptionAPI"));

const port = process.env.PORT || 80;

const app = express();

app.use(bodyParser.json());

plugInVehiclesAPI(app);
renewableSourcesAPI(app);
oilCoalNuclearEnergyConsumptionAPI(app);

app.listen(port, () => {
	console.log("Server ready");
});


console.log("Starting server...");// Llamamos a los modulos
