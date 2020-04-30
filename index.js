// We call the modules.
const express = require("express");
const bodyParser = require("body-parser");

const plugInVehiclesAPI = require("./src/back/plugInVehiclesAPI");
const renewableSourcesAPI = require("./src/back/renewableSourcesAPI");
const oilCoalNuclearEnergyConsumptionAPI = require("./src/back/oilCoalNuclearEnergyConsumptionAPI");

var app = express();

app.use(bodyParser.json());

plugInVehiclesAPI(app);
renewableSourcesAPI(app);
oilCoalNuclearEnergyConsumptionAPI(app);

var port = process.env.PORT || 12345;

app.use("/", express.static("./public"));

app.listen(port, () => {
	console.log("Server ready");
});

console.log("Starting server...");