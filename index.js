// We call the modules.
const express = require("express");
const bodyParser = require("body-parser");

const plugInVehiclesAPI = require("./src/back/plugInVehiclesAPI");
const renewableSourcesAPIv1 = require("./src/back/renewableSourcesAPI/v1");
const renewableSourcesAPIv2 = require("./src/back/renewableSourcesAPI/v2");
const oilCoalNuclearEnergyConsumptionAPI = require("./src/back/oilCoalNuclearEnergyConsumptionAPI");

var app = express();

app.use(bodyParser.json());

plugInVehiclesAPI(app);
renewableSourcesAPIv1(app);
renewableSourcesAPIv2(app);
oilCoalNuclearEnergyConsumptionAPI(app);

var port = process.env.PORT || 12345;

app.use("/", express.static("./public"));

app.listen(port, () => {
	console.log("Server ready");
});

console.log("Starting server...");