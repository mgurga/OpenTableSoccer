const express = require("express");

class ExpressHoster {
	constructor(app) {
		this.app = app;
	}
	start() {
		this.app.use("/", express.static(__dirname + "/public"));
		this.app.use("/js", express.static(__dirname + "/public/js"));
		this.app.use("/assets", express.static(__dirname + "/public/assets"));

		this.app.get("/", function (req, res) {
			res.sendFile("index.html", options);
		});
	}
}

module.exports = ExpressHoster;