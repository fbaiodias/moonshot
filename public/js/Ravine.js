/**************************************************
** GAME Ravine CLASS
**************************************************/
var Ravine = function(startX, startY) {
	var x = startX,
		y = startY,
		onPlayer = false,
		image,
		id;

	image = new Image();
	imageBalon = new Image();
	image.src = "images/ravine.png";
	imageBalon.src = "images/balon.png";
	
	var width = 60,
		height = 60;

	console.log("NEW RAVE");

	// Getters and setters
	var getX = function() {
		return x;
	};

	var getY = function() {
		return y;
	};

	var isOnPlayer = function() {
		return onPlayer;
	};

	var setX = function(newX) {
		x = newX;
	};

	var setY = function(newY) {
		y = newY;
	};

	var setOn = function(newY) {
		onPlayer = newY;
	};

	var draw = function(ctx, localPlayer) {
		console.log("MAMAMAS");
		ctx.drawImage(image, imageX, imageY);
	};	

	var drawOn = function(ctx, imageX, imageY) {
		console.log("MAMAMAS");
		//ctx.drawImage(imageBalon, imageX-45, imageY-70);
		//ctx.drawImage(image, imageX-40, imageY-60);
	};	

	// Define which variables and methods can be accessed
	return {
		getX: getX,
		getY: getY,
		isOnPlayer: isOnPlayer,
		setX: setX,
		setY: setY,
		setOn: setOn,
		draw: draw,
		drawOn: drawOn,
		height: height,
		width: width,
		id: id
	}
};