/**************************************************
** GAME Radio CLASS
**************************************************/
var Radio = function(startX, startY) {
	var x = startX,
		y = startY,
		onPlayer = false,
		image,
		//playerXposition = 666,
		id;

	var clickSound = new Audio("POL-rocket-station-short.wav");

	image = new Image();
	imageBalon = new Image();
	image.src = "images/radio.png";
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

	var setOn = function(newY) {
		onPlayer = newY;
	};

	var draw = function(ctx, localPlayer) {
		if (onPlayer == false){
			var imageX = playerXposition-(localPlayer.getX()-x)-image.width/2,
				imageY = y-image.height/2;

			ctx.drawImage(image, imageX, imageY);
			clickSound.pause();
		}
		else if(localPlayer.objectId == this.id){
			ctx.drawImage(imageBalon, playerXposition-90, localPlayer.getY()-120);
			ctx.drawImage(image, playerXposition-81, localPlayer.getY()-117);
			clickSound.play();
		}

	};	

	var drawOn = function(ctx, imageX, imageY) {
		ctx.drawImage(imageBalon, imageX-45, imageY-70);
		ctx.drawImage(image, imageX-40, imageY-60);
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