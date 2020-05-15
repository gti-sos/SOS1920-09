// We call the modules.
const express = require("express");
const bodyParser = require("body-parser");

const plugInVehiclesAPIv1 = require("./src/back/plugInVehiclesAPI/v1");
const plugInVehiclesAPIv2 = require("./src/back/plugInVehiclesAPI/v2");
const renewableSourcesAPIv1 = require("./src/back/renewableSourcesAPI/v1");
const renewableSourcesAPIv2 = require("./src/back/renewableSourcesAPI/v2");
const oilCoalNuclearEnergyConsumptionAPIv1 = require("./src/back/oilCoalNuclearEnergyConsumptionAPI/v1");
const oilCoalNuclearEnergyConsumptionAPIv2 = require("./src/back/oilCoalNuclearEnergyConsumptionAPI/v2");

var app = express();

app.get("/data", (req,res) =>{
    var data =  [{
        name: 'Representatives',
        keys: ['name', 'y', 'color', 'label'],
        data: [
            ['The Left', 69, '#BE3075', 'DIE LINKE'],
            ['Social Democratic Party', 153, '#EB001F', 'SPD'],
            ['Alliance 90/The Greens', 67, '#64A12D', 'GRÜNE'],
            ['Free Democratic Party', 80, '#FFED00', 'FDP'],
            ['Christian Democratic Union', 200, '#000000', 'CDU'],
            ['Christian Social Union in Bavaria', 46, '#008AC5', 'CSU'],
            ['Alternative for Germany', 94, '#009EE0', 'AfD']
        ],
        dataLabels: {
            enabled: true,
            format: '{point.label}'
        },

        // Circular options
        center: ['50%', '88%'],
        size: '170%',
        startAngle: -100,
        endAngle: 100
        }];
    res.send(data);
});

app.use(bodyParser.json());

plugInVehiclesAPIv1(app);
plugInVehiclesAPIv2(app);
renewableSourcesAPIv1(app);
renewableSourcesAPIv2(app);
oilCoalNuclearEnergyConsumptionAPIv1(app);
oilCoalNuclearEnergyConsumptionAPIv2(app);

var port = process.env.PORT || 12345;

app.use("/", express.static("./public"));

app.listen(port, () => {
	console.log("Server ready");
});

console.log("Starting server...");