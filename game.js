/**************************************************
** NODE.JS REQUIREMENTS
**************************************************/
var util = require("util"),					// Utility resources (logging, object inspection, etc)
	io = require("socket.io"),				// Socket.IO
	Player = require("./Player").Player;	// Player class
	Gun = require("./Gun").Gun;				// Gun class
	Matches = require("./Matches").Matches,	// Matches class
	Apple = require("./Apple").Apple,		// Apple class
	FirstAid = require("./FirstAid").FirstAid, // FirstAid class
	PillFood = require("./PillFood").PillFood,	
	Oxygen = require("./Oxygen").Oxygen;	// FirstAid class

var fs = require('fs');

/**************************************************
** GAME VARIABLES
**************************************************/
var socket,		// Socket controller
	guns,	// Array of guns
	objects,
	scores;	// Array of game objects


/**************************************************
** GAME INITIALISATION
**************************************************/
function init() {
	// Create an empty array to store players
	players = [];
	scores = [];

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

	var content;
    fs.readFile('./highscores.json', function read(err, data) {
        if (err) {
            console.log(err);
        }
        content = data;
        scores = JSON.parse(data);
    });
    console.log(content);
    //scores = JSON.parse(content);

	// Place guns randomly
	for(var i=0; i < Math.round(Math.random()*(1000))+100; i++) {
		var newObject = new Gun(Math.round(Math.random()*(30000)), Math.round(Math.random()*(1000)));
		newObject.id = "G"+i;
		objects.push(newObject);
	}

	// Place matches randomly
	for(var i=0; i < Math.round(Math.random()*(1000))+100; i++) {
		var newObject = new Matches(Math.round(Math.random()*(30000)), Math.round(Math.random()*(1000)));
		newObject.id = "M"+i;
		objects.push(newObject);
	}

	// Place Apple randomly
	for(var i=0; i < Math.round(Math.random()*(1000))+100; i++) {
		var newObject = new Apple(Math.round(Math.random()*(30000)), Math.round(Math.random()*(1000)));
		newObject.id = "A"+i;
		objects.push(newObject);
	}

	// Place FirstAid randomly
	for(var i=0; i < Math.round(Math.random()*(1000))+100; i++) {
		var newObject = new FirstAid(Math.round(Math.random()*(30000)), Math.round(Math.random()*(1000)));
		newObject.id = "F"+i;
		objects.push(newObject);
	}

	// Place Oxygen randomly
	for(var i=0; i < Math.round(Math.random()*(1000))+100; i++) {
		var newObject = new Oxygen(Math.round(Math.random()*(30000)), Math.round(Math.random()*(1000)));
		newObject.id = "O"+i;
		objects.push(newObject);
	}

	// Place PillFood
	for(var i=0; i < Math.round(Math.random()*(1000))+100; i++) {
		var newObject = new  PillFood(Math.round(Math.random()*(30000)), Math.round(Math.random()*(1000)));
		newObject.id = "PF"+i;
		objects.push(newObject);

	//util.log(JSON.stringify(objects));


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

	// Listen for new player message
	client.on("dead player", onDeadPlayer);

	// Listen for new player message
	client.on("player score", onPlayerScore);

	// Listen for new player message
	client.on("player shot", onPlayerShot);

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

	this.emit("your id", {id: this.id});

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
function onDeadPlayer(data) {
	// Find player in array
	var deadPlayer = playerById(this.id);

	// Player not found
	if (!deadPlayer) {
		util.log("Player not found: "+this.id);
		return;
	};

	// Broadcast updated position to connected socket clients
	this.broadcast.emit("dead player", {id: deadPlayer.id});
};

// Player has moved
function onPlayerShot(data) {
	// Find player in array
	var deadPlayer = playerById(this.id);

	// Player not found
	if (!deadPlayer) {
		util.log("Player not found: "+this.id);
		console.log(JSON.stringify(players));
		return;
	};

	console.log("SHOOOOOOT");

	// Broadcast updated position to connected socket clients
	this.broadcast.emit("player shot", {id: deadPlayer.id});
};

// Player has moved
function onPlayerScore(data) {
	scores.push({
		name: data.playerName,
		score: data.score
	});

	scores.sort(function (a,b) {
	  if (a.score > b.score)
	     return -1;
	  if (a.score < b.score)
	    return 1;
	  return 0;
	});

	fs.writeFile("highscores.json", JSON.stringify(scores), function(err) {
	    if(err) {
	        console.log(err);
	    } else {
	        console.log("The file was saved!");
	    }
	}); 


	// Broadcast updated position to connected socket clients
	this.emit("highscores", {scores: scores});
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

	console.log("CATCHED THE", catchObject.id);

	var dropObject = objectById(catchPlayer.objectId);

	if(dropObject) {
		dropObject.onPlayer = false;
		var tmpX = catchPlayer.getX()-100;
		var tmpY = catchPlayer.getY();

		dropObject.setX(tmpX);
		dropObject.setY(tmpY);

		console.log("DROP THE", dropObject.id, "IN", tmpX, tmpY);

		this.emit("drop object", {id: catchPlayer.id, objectId: dropObject.id, x: tmpX, y: tmpY});
		this.broadcast.emit("drop object", {id: catchPlayer.id, objectId: dropObject.id, x: tmpX, y: tmpY});
	};
	
	catchObject.onPlayer = true;
	catchPlayer.objectId = catchObject.id;

	//console.log(JSON.stringify(catchPlayer));

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