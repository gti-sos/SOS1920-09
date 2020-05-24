// We call the modules.
const express = require("express");
const bodyParser = require("body-parser");
const cors = require('cors');


const plugInVehiclesAPIv1 = require("./src/back/plugInVehiclesAPI/v1");
const plugInVehiclesAPIv2 = require("./src/back/plugInVehiclesAPI/v2");
const plugInVehiclesAPIv3 = require("./src/back/plugInVehiclesAPI/v3");
const renewableSourcesAPIv1 = require("./src/back/renewableSourcesAPI/v1");
const renewableSourcesAPIv2 = require("./src/back/renewableSourcesAPI/v2");
const renewableSourcesAPIv3 = require("./src/back/renewableSourcesAPI/v3");
const renewableSourcesAPIv4 = require("./src/back/renewableSourcesAPI/v4");
const oilCoalNuclearEnergyConsumptionAPIv1 = require("./src/back/oilCoalNuclearEnergyConsumptionAPI/v1");
const oilCoalNuclearEnergyConsumptionAPIv2 = require("./src/back/oilCoalNuclearEnergyConsumptionAPI/v2");
const oilCoalNuclearEnergyConsumptionAPIv3 = require("./src/back/oilCoalNuclearEnergyConsumptionAPI/v3");

var app = express();

app.use(bodyParser.json());
app.use(cors());

plugInVehiclesAPIv1(app);
plugInVehiclesAPIv2(app);
//plugInVehiclesAPIv3(app);
renewableSourcesAPIv1(app);
renewableSourcesAPIv2(app);
renewableSourcesAPIv3(app);
renewableSourcesAPIv4(app);
oilCoalNuclearEnergyConsumptionAPIv1(app);
oilCoalNuclearEnergyConsumptionAPIv2(app);
//oilCoalNuclearEnergyConsumptionAPIv3(app);

var port = process.env.PORT || 12345;

app.use("/", express.static("./public"));

app.listen(port, () => {
	console.log("Server ready");
});

console.log("Starting server...");