/**************************************************
** GAME VARIABLES
**************************************************/
var canvas,			// Canvas DOM element
	ctx,			// Canvas rendering context
	keys,			// Keyboard input
	localPlayer,	// Local player
	remotePlayers,	// Remote players
	objects,		// Remote objects
	socket,			// Socket connection
	moon;

var playerXposition = 666;

/**************************************************
** GAME INITIALISATION
**************************************************/
function init() {
	// Declare the canvas and rendering context
	canvas = document.getElementById("gameCanvas");
	ctx = canvas.getContext("2d");

	// Maximise the canvas
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;

	// Initialise keyboard controls
	keys = new Keys();

	// Calculate a random start position for the local player
	// The minus 5 (half a player size) stops the player being
	// placed right on the egde of the screen
	var startX = Math.round(Math.random()*(canvas.width-5)),
		startY = Math.round((Math.random()*(canvas.height-5))+190);

	// Initialise the local player
	localPlayer = new Player(0, startY);

	// Initialise socket connection
	socket = io.connect("http://franciscodias.net", {port: 8000, transports: ["websocket"]});

	// Initialise remote players array
	remotePlayers = [];
	objects = [];

	moon = new Image();
	moon.src = "images/moon.png";

	// Start listening for events
	setEventHandlers();
};


/**************************************************
** GAME EVENT HANDLERS
**************************************************/
var setEventHandlers = function() {
	// Keyboard
	window.addEventListener("keydown", onKeydown, false);
	window.addEventListener("keyup", onKeyup, false);

	// Window resize
	window.addEventListener("resize", onResize, false);

	// Socket connection successful
	socket.on("connect", onSocketConnected);

	// Socket disconnection
	socket.on("disconnect", onSocketDisconnect);

	// New player message received
	socket.on("new player", onNewPlayer);

	// New gun message received
	socket.on("new object", onNewObject);

	// Player move message received
	socket.on("move player", onMovePlayer);

	// Player removed message received
	socket.on("remove player", onRemovePlayer);

	// Player catch object received
	socket.on("catch object", onCatchObject);

	// Player drop object received
	socket.on("drop object", onDropObject);
};

// Keyboard key down
function onKeydown(e) {
	if (localPlayer) {
		keys.onKeyDown(e);
	};
};

// Keyboard key up
function onKeyup(e) {
	if (localPlayer) {
		keys.onKeyUp(e);
	};
};

// Browser window resize
function onResize(e) {
	// Maximise the canvas
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;
};

// Socket connected
function onSocketConnected() {
	console.log("Connected to socket server");

	// Send local player data to the game server
	socket.emit("new player", {x: localPlayer.getX(), y: localPlayer.getY()});
};

// Socket disconnected
function onSocketDisconnect() {
	console.log("Disconnected from socket server");
};

// New player
function onNewPlayer(data) {
	console.log("New player connected: "+data.id);

	// Initialise the new player
	var newPlayer = new Player(data.x, data.y);
	newPlayer.id = data.id;

	// Add new player to the remote players array
	remotePlayers.push(newPlayer);
};

// New object
function onNewObject(data) {
	//console.log("New object!")
	if(data.id.charAt(0) == "G") {
		console.log("New gun!", data.id);
		// Initialise the new gun
		var newGun = new Gun(data.x, data.y);
		newGun.setOn(data.onPlayer);
		newGun.id = data.id;

		// Add new gun to the objects array
		objects.push(newGun);
	} 
	else if(data.id.charAt(0) == "M") {
		console.log("New matches!", data.id);
		// Initialise the new gun
		var newMatches = new Matches(data.x, data.y);
		newMatches.setOn(data.onPlayer);
		newMatches.id = data.id;

		// Add new gun to the objects array
		objects.push(newMatches);
	}
};

// Move player
function onMovePlayer(data) {
	var movePlayer = playerById(data.id);

	// Player not found
	if (!movePlayer) {
		console.log("Player not found: "+data.id);
		return;
	};

	// Update player position
	movePlayer.setX(data.x);
	movePlayer.setY(data.y);
};

// Catch Object
function onCatchObject(data) {
	// Find player in array

	var catchPlayer = playerById(data.id);
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
	catchPlayer.objectId = catchObject.id;
	catchObject.setOn(true);

	console.log(JSON.stringify(catchObject));
};

// Drop Object
function onDropObject(data) {
	var dropObject = objectById(data.objectId);

	if(dropObject) {
		dropObject.setOn(false);
		dropObject.setX(data.x);
		dropObject.setY(data.y);
	};
};

// Remove player
function onRemovePlayer(data) {
	var removePlayer = playerById(data.id);

	// Player not found
	if (!removePlayer) {
		console.log("Player not found: "+data.id);
		return;
	};

	// Remove player from array
	remotePlayers.splice(remotePlayers.indexOf(removePlayer), 1);
};


/**************************************************
** GAME ANIMATION LOOP
**************************************************/
function animate() {
	update();
	draw();

	// Request a new animation frame using Paul Irish's shim
	window.requestAnimFrame(animate);
};


/**************************************************
** GAME UPDATE
**************************************************/
function update() {
	// Update local player and check for change
	if (localPlayer.update(keys)) {
		// Send local player data to the game server
		socket.emit("move player", {x: localPlayer.getX(), y: localPlayer.getY()});
	};

	//console.log("players", remotePlayers.length, "guns", guns.length, "matches", matches.length);
	var i;
	for (i = 0; i < remotePlayers.length; i++) {
		//remotePlayers[i].drawAsRemote(ctx, localPlayer);
	};
	for (i = 0; i < objects.length; i++) {
		checkCollision(localPlayer, objects[i]);
	};
};


/**************************************************
** GAME DRAW
**************************************************/
function drawBackground(player) {
	ctx.fillStyle = "rgb(0,0,50)";
  	ctx.fillRect(0, 0, canvas.width, canvas.height);
	
	var moonStart = Math.floor(player.getX() / moon.width);
	var moonRepeats = Math.floor(canvas.width / moon.width)+2;

	for(var i=moonStart; i<moonStart+moonRepeats; i++) {
		var moonX = -player.getX()+i*moon.width;
		var moonY = canvas.height - moon.height;
		ctx.drawImage(moon,moonX,moonY);		
	}	
}

function draw() {
	// Draw the background
	drawBackground(localPlayer)
	// Draw the local player
	localPlayer.draw(ctx);

	// Draw the remote players
	var i;
	for (i = 0; i < remotePlayers.length; i++) {
		remotePlayers[i].drawAsRemote(ctx, localPlayer);
	};
	for (i = 0; i < objects.length; i++) {
		objects[i].draw(ctx, localPlayer);
	};
};


/**************************************************
** GAME HELPER FUNCTIONS
**************************************************/
// Find player by ID
function playerById(id) {
	var i;
	for (i = 0; i < remotePlayers.length; i++) {
		if (remotePlayers[i].id == id)
			return remotePlayers[i];
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

function checkCollision(player, object) {
	//console.log(object.getX(), object.getY(), object.width, object.height)
	if (!object.isOnPlayer() && player.getX() < object.getX() + object.width  && player.getX() + player.width  > object.getX() &&
    player.getY() < object.getY() + object.height && player.getY() + player.height > object.getY()) {
		// The objects are touching
		object.setOn(true);
		player.objectId = object.id;

		//console.log(JSON.stringify(player))

		// Send local player data to the game server
		socket.emit("catch object", {objectId: object.id});
	}
}

