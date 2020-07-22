
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
			//console.log("ids in searchroom:");
			//console.log(socketids);
		}

		// check the search room if 2 or more people are in it
		if(!(searchroom == undefined) && socketids.length >= 2) {
			//console.log("printing socket ids in searchroom and removing 2:"); // before remove
			socketids = Object.keys(searchroom.sockets);
			
			// readys the users from the game
			this.usersready(socketids[0], socketids[1]);

			// remove sockets from searching room
			this.removefromroom(socketids[0], "searching");
			this.removefromroom(socketids[1], "searching");
		}
	}
	
	usersready(socket1id, socket2id) {
		var usersready = [false, false];

		// attach ready and notready to first user
		this.io.to(socket1id).emit("usersreadyup");
		this.io.to(socket1id).on("ready", (socket) => {
			usersready[0] = true;
			console.log("user 1 is ready");
			socket.emit("lockedin");
		});
		this.io.to(socket1id).on("notready", (socket) => {
			// user responded not ready
			console.log("user 1 is NOT ready");
		});

		// attach ready and notready to second user
		this.io.to(socket2id).emit("usersreadyup");
		this.io.to(socket2id).on("ready", (socket) => {
			usersready[1] = true;
			console.log("user 2 is ready");
			socket.emit("lockedin");
		});
		this.io.to(socket2id).on("notready", (socket) => {
			// user responded not ready
			console.log("user 2 is NOT ready");
		});

		var failedReadys = 0;

		var checkUserReady = setInterval(() => {
			if(usersready[0] == true && usersready[1] == true) {
				clearInterval(checkUserReady);
				console.log("starting game");
				this.startgame(firstuser, seconduser);
			}
			if(failedReadys >= 100) {
				clearInterval(checkUserReady);
				this.io.to(socket1id).emit("cancelled", {"reason":"other player failed to ready up"});
				this.io.to(socket2id).emit("cancelled", {"reason":"other player failed to ready up"});
				console.log("users failed to ready");
				console.log(socket1id + " and " + socket2id);
			}
			failedReadys++;
		}, 100);
	}

	startgame(socket1id, socket2id) {
		console.log("starting game");
	}

	removefromroom(id, room) {
		delete this.io.sockets.adapter.rooms[room].sockets[id];
	}
}

module.exports = SocketHandler;