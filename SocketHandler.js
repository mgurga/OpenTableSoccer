
class SocketHandler {
	constructor(io) {
		this.io = io;
		this.activeUsers = {};
	}
	start() {
		this.io.on("connection", socket => {
			console.log(socket.id + " user has connected");
			this.activeUsers[socket.id] = socket;
			socket.on("searchforgame", () => {
				console.log("adding " + socket.id + " to searching room");
				socket.join("searching", () => {
					var rooms = this.io.sockets.adapter.rooms["searching"].sockets;
					console.log("people in searching room: ")
    				console.log(rooms);
				});
			});
		});
		this.io.on("disconnect", socket => {
			delete this.activeUsers[socket.id];
			console.log(socket.id + " user has disconnected");
		});
	}

	update() {
		var searchroom = this.io.sockets.adapter.rooms['searching'];
		var socketids = [];
		if(!(searchroom == undefined)) {
			socketids = Object.keys(searchroom.sockets);
			console.log("ids in searchroom:");
			console.log(socketids);
		}

		// check the search room if 2 or more people are in it
		if(!(searchroom == undefined) && socketids.length >= 2) {
			//console.log("printing socket ids in searchroom and removing 2:"); // before remove
			socketids = Object.keys(searchroom.sockets);
			
			// readys the users from the game
			// this.usersready(socketids[0], socketids[1]);

			// remove sockets from searching room
			delete this.io.sockets.adapter.rooms['searching'].sockets[socketids[0]];
			delete this.io.sockets.adapter.rooms['searching'].sockets[socketids[1]];
		}
	}
	
	usersready(socket1id, socket2id) {
		var usersready = [false, false];
		//console.log(socketids);

		// attach ready and notready to first user
		this.io.to(firstuser).emit("ready");
		this.io.to(firstuser).on("ready", (socket) => {
			usersockets[0] = socket;
			usersready[0] = true;
			socket.emit("lockedin");
		});
		this.io.to(firstuser).on("notready", (socket) => {
			socket.leave("searching");
		});

		// attach ready and notready to second user
		this.io.to(seconduser).emit("ready");
		this.io.to(seconduser).on("ready", (socket) => {
			usersockets[1] = socket;
			usersready[1] = true;
			socket.emit("lockedin");
		});
		this.io.to(seconduser).on("notready", (socket) => {
			socket.leave("searching");
			socket.emit("leftsearching");
		});

		var failedReadys = 0;

		var checkUserReady = setInterval(() => {
			if(usersready[0] == true && usersready[1] == true) {
				clearInterval(checkUserReady);
				this.startgame(firstuser, seconduser);
			}
			if(failedReadys >= 100) {
				clearInterval(checkUserReady);
				this.io.to(firstuser).emit("cancelled", {"reason":"other player failed to ready up"});
				this.activeUsers[firstuser].leave("searching");
				this.io.to(seconduser).emit("cancelled", {"reason":"other player failed to ready up"});
				this.activeUsers[seconduser].leave("searching");
				console.log("removing 2 people from searching room");
				console.log("current searching room:");
				console.log(socketids);
			}
			failedReadys++;
		}, 100);
	}

	startgame(socket1id, socket2id) {
		console.log("starting game");
	}
}

module.exports = SocketHandler;