/**************************************************
** GAME Matches CLASS
**************************************************/
var Matches = function(startX, startY) {
	var x = startX,
		y = startY,
		onPlayer = false,
		image;

	image = new Image();
	image.src = "images/matches.png";
	

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

	var setOnPlayer = function(newState) {
		onPlayer = newState;
	};

	var draw = function(ctx, localPlayer) {
		var imageX = 100-(localPlayer.getX()-x)-image.width/2,
			imageY = y-image.height/2;

		ctx.drawImage(image, imageX, imageY);
	};	

	// Define which variables and methods can be accessed
	return {
		getX: getX,
		getY: getY,
		isOnPlayer: isOnPlayer,
		setX: setX,
		setY: setY,
		setOnPlayer: setOnPlayer,
		draw: draw
	}
};