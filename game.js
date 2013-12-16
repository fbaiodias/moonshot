/**************************************************
** NODE.JS REQUIREMENTS
**************************************************/
var util = require("util"),					// Utility resources (logging, object inspection, etc)
	io = require("socket.io"),				// Socket.IO
	Player = require("./Player").Player;	// Player class
	Gun = require("./Gun").Gun;				// Gun class
	Matches = require("./Matches").Matches;	// Matches class


/**************************************************
** GAME VARIABLES
**************************************************/
var socket,		// Socket controller
	guns,	// Array of guns
	objects;	// Array of game objects


/**************************************************
** GAME INITIALISATION
**************************************************/
function init() {
	// Create an empty array to store players
	players = [];

	// Create empty arrays to store objects
	objects = [];

	// Set up Socket.IO to listen on port 8000
	socket = io.listen(8000);

	// Configure Socket.IO
	socket.configure(function() {
		// Only use WebSockets
		socket.set("transports", ["websocket"]);

		// Restrict log output
		socket.set("log level", 2);
	});

	// Place guns randomly
	for(var i=0; i < Math.round(Math.random()*(10))+5; i++) {
		var newGun = new Gun(Math.round(Math.random()*(10000)), Math.round(Math.random()*(1000)));
		newGun.id = "G"+i;
		objects.push(newGun);
	}

	// Place matches randomly
	for(var i=0; i < Math.round(Math.random()*(10))+5; i++) {
		var newMatches = new Matches(Math.round(Math.random()*(10000)), Math.round(Math.random()*(1000)));
		newMatches.id = "M"+i;
		objects.push(newMatches);
	}

	util.log(JSON.stringify(objects));


	// Start listening for events
	setEventHandlers();
};


/**************************************************
** GAME EVENT HANDLERS
**************************************************/
var setEventHandlers = function() {
	// Socket.IO
	socket.sockets.on("connection", onSocketConnection);
};

// New socket connection
function onSocketConnection(client) {
	util.log("New player has connected: "+client.id);

	// Listen for client disconnected
	client.on("disconnect", onClientDisconnect);

	// Listen for new player message
	client.on("new player", onNewPlayer);

	// Listen for move player message
	client.on("move player", onMovePlayer);

	// Listen for catch object message
	client.on("catch object", onCatchObject);
};

// Socket client has disconnected
function onClientDisconnect() {
	util.log("Player has disconnected: "+this.id);

	var removePlayer = playerById(this.id);

	// Player not found
	if (!removePlayer) {
		util.log("Player not found: "+this.id);
		return;
	};

	// Remove player from players array
	players.splice(players.indexOf(removePlayer), 1);

	// Broadcast removed player to connected socket clients
	this.broadcast.emit("remove player", {id: this.id});
};

// New player has joined
function onNewPlayer(data) {
	// Create a new player
	var newPlayer = new Player(data.x, data.y);
	newPlayer.id = this.id;

	// Broadcast new player to connected socket clients
	this.broadcast.emit("new player", {id: newPlayer.id, x: newPlayer.getX(), y: newPlayer.getY()});

	// Send existing players to the new player
	var i, existingPlayer;
	for (i = 0; i < players.length; i++) {
		existingPlayer = players[i];
		this.emit("new player", {id: existingPlayer.id, x: existingPlayer.getX(), y: existingPlayer.getY()});
	};
	
	var existingObject;
	for (i = 0; i < objects.length; i++) {
		existingObject = objects[i];
		this.emit("new object", {id: existingObject.id, x: existingObject.getX(), y: existingObject.getY(), onPlayer: existingObject.onPlayer});
	};
	
	// Add new player to the players array
	players.push(newPlayer);
};

// Player has moved
function onMovePlayer(data) {
	// Find player in array
	var movePlayer = playerById(this.id);

	// Player not found
	if (!movePlayer) {
		util.log("Player not found: "+this.id);
		return;
	};

	// Update player position
	movePlayer.setX(data.x);
	movePlayer.setY(data.y);

	// Broadcast updated position to connected socket clients
	this.broadcast.emit("move player", {id: movePlayer.id, x: movePlayer.getX(), y: movePlayer.getY()});
};

// Player has moved
function onCatchObject(data) {
	// Find player in array
	var catchPlayer = playerById(this.id);
	var catchObject = objectById(data.objectId);
	// Player not found
	if (!catchPlayer) {
		util.log("Player not found: "+this.id);
		return;
	};

	if(!catchObject) {
		util.log("Object not found: "+data.objectId);
		return;
	};
	
	catchObject.onPlayer = true;

	// Broadcast updated position to connected socket clients
	this.broadcast.emit("catch object", {id: catchPlayer.id, objectId: catchObject.id});
};


/**************************************************
** GAME HELPER FUNCTIONS
**************************************************/
// Find player by ID
function playerById(id) {
	var i;
	for (i = 0; i < players.length; i++) {
		if (players[i].id == id)
			return players[i];
	};
	
	return false;
};

// Find object by ID
function objectById(id) {
	var i;
	for (i = 0; i < objects.length; i++) {
		if (objects[i].id == id)
			return objects[i];
	};
	
	return false;
};


/**************************************************
** RUN THE GAME
**************************************************/
init();