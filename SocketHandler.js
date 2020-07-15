
class SocketHandler {
	constructor(io) {
		this.io = io;
		this.activeUsers = [];
	}
	start() {
		this.io.on("connection", socket => {
			console.log(socket.id + " user has connected");
			socket.on("searchforgame", () => {
				console.log("adding " + socket.id + " to searching room");
				socket.join("searching", () => {
					var rooms = this.io.sockets.adapter.rooms;
					console.log("people in searching room: ")
    				console.log(rooms);
				});
			});
		});
		this.io.on("disconnect", socket => {
			console.log(socket.id + " user has disconnected");
		});
	}
	update() {
		// check the search room if 2 people are in it
		if(typeof this.io.sockets.adapter.rooms['searching'] == undefined && this.io.sockets.adapter.rooms['searching'].length >= 2) {

		}
	}
}

module.exports = SocketHandler;