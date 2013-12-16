/**************************************************
** GAME GUN CLASS
**************************************************/
var Apple = function(startX, startY) {
	var x = startX,
		y = startY,
		onPlayer = false,
		image,
		id;

	image = new Image();
	imageBalon = new Image();
	image.src = "images/apple.png";
	imageBalon.src = "images/balon.png";

	var width = 60,
		height = 60;
	

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
		if (onPlayer == false){
			var imageX = 100-(localPlayer.getX()-x)-image.width/2,
				imageY = y-image.height/2;

			ctx.drawImage(image, imageX, imageY);
		}
		else {
			ctx.drawImage(imageBalon, 10, localPlayer.getY()-120)
			ctx.drawImage(image, 14, localPlayer.getY()-110)
		}	
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
		height: height,
		width: width,
		id: id
	}
};