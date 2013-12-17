/**************************************************
** GAME Bullet CLASS
**************************************************/
var Bullet = function(startX, startY) {
	var x = startX,
		y = startY,
		onPlayer = false,
		image,
		ticks = 0,
		time = 200,
		speed = 20,
		id;

	image = new Image();
	image.src = "images/bullet.png";

	var width = 60,
		height = 60;
	

	// Getters and setters
	var getX = function() {
		return x;
	};

	var getY = function() {
		return y;
	};

	var setX = function(newX) {
		x = newX;
	};

	var setY = function(newY) {
		y = newY;
	};

	var update = function() {
		if(ticks < time) {
			x += speed; 
			ticks++;
		}
	};

	var isOnPlayer = function() {
		return false;
	};

	var draw = function(ctx, localPlayer) {
		if(ticks < time) {
			var imageX = playerXposition-(localPlayer.getX()-x)-image.width/2;

			ctx.drawImage(image, imageX, y);	
		}
	};	

	// Define which variables and methods can be accessed
	return {
		getX: getX,
		getY: getY,
		setX: setX,
		setY: setY,
		update: update,
		isOnPlayer: isOnPlayer,
		draw: draw,
		height: height,
		width: width,
		id: id
	}
};