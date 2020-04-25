// We call the modules
const express = require("express");
const bodyParser = require("body-parser");

const plugInVehiclesAPI = require("./src/back/plugInVehiclesAPI");
const renewableSourcesAPI = require("./src/back/renewableSourcesAPI");
const oilCoalNuclearEnergyConsumptionAPI = require("./src/back/oilCoalNuclearEnergyConsumptionAPI");

var app = express();

app.use(bodyParser.json());

<<<<<<< HEAD
=======


>>>>>>> 6f9a25fb4794f63dc873d4ce37270f9d9c31b2fd
plugInVehiclesAPI(app);
renewableSourcesAPI(app);
oilCoalNuclearEnergyConsumptionAPI(app);

var port = process.env.PORT || 12345;

app.use("/", express.static("./public"));

app.listen(port, () => {
	console.log("Server ready");
});

console.log("Starting server...");