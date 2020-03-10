const express = require("express");
var app = express();

var port = process.env.PORT || 80; // Port is the default port and if it is not defined, it is 80

app.use ("/", express.static("./public"));

app.listen(port, () => {
	console.log("Server ready!!");
});

console.log("Starting server...");