const express = require("express");
const PORT = process.env.PORT || 9000;
const app = express();
const server = require("http").createServer(app);
const io = require("socket.io").listen(server);

// host the static express website
const ExpressHoster = require("./ExpressHoster");
let hoster = new ExpressHoster(app);
hoster.start();

// start socket server
const SocketHandler = require("./SocketHandler");
let socket = new SocketHandler(io); 
socket.start();
setInterval(() => {
	socket.update();
}, 100)

server.listen(PORT);