/**************************************************
** GAME SpaceShipEnding CLASS
**************************************************/
var SpaceShipEnding = function(startX, startY) {
	var x = startX,
		y = startY,
		onPlayer = false,
		rocketEnd,
		rocketGo,
		id;

	rocketEnd = new Image();
	rocketGo = new Image();
	rocketEnd.src = "images/rocketEnd.png";
	rocketGo.src = "images/rocketGo.png";

	var width = 500,
		height = 500;
	

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

	var setOn = function(newState) {
		onPlayer = newState;
	};

	var draw = function(ctx, localPlayer) {
		var imageX = playerXposition-(localPlayer.getX()-x)-rocketEnd.width/2,
			imageY = canvas.height-600;

		if (onPlayer == false){
			ctx.drawImage(rocketEnd, imageX, imageY);
		}
		else{
			ctx.drawImage(rocketGo, imageX, imageY);
		}	
	};	

	var drawOn = function(ctx, imageX, imageY) {
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