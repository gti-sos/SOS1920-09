// We call the modules.
const express = require("express");
const bodyParser = require("body-parser");

const plugInVehiclesAPIv1 = require("./src/back/plugInVehiclesAPI/v1");
const plugInVehiclesAPIv2 = require("./src/back/plugInVehiclesAPI/v2");
const renewableSourcesAPIv1 = require("./src/back/renewableSourcesAPI/v1");
const renewableSourcesAPIv2 = require("./src/back/renewableSourcesAPI/v2");
const oilCoalNuclearEnergyConsumptionAPI = require("./src/back/oilCoalNuclearEnergyConsumptionAPI");

var app = express();

app.use(bodyParser.json());

plugInVehiclesAPIv1(app);
plugInVehiclesAPIv2(app);
renewableSourcesAPIv1(app);
renewableSourcesAPIv2(app);
oilCoalNuclearEnergyConsumptionAPI(app);

var port = process.env.PORT || 12345;

app.use("/", express.static("./public"));

app.listen(port, () => {
	console.log("Server ready");
});

console.log("Starting server...");