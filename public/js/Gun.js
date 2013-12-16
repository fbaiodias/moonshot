/**************************************************
** GAME GUN CLASS
**************************************************/
var Gun = function(startX, startY) {
	var x = startX,
		y = startY,
		onPlayer = false,
		image,
		bullet,
		//playerXposition = 666,
		id;

	image = new Image();
	imageBalon = new Image();
	image.src = "images/gun.png";
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

	var shoot = function(localPlayer) {
		bullet = new Bullet(localPlayer.getX(), localPlayer.getY());
	};

	var draw = function(ctx, localPlayer) {
		if (onPlayer == false){
			var imageX = playerXposition-(localPlayer.getX()-x)-image.width/2,
				imageY = y-image.height/2;

			ctx.drawImage(image, imageX, imageY);
		}
		else if(localPlayer.objectId == this.id){
			ctx.drawImage(imageBalon, playerXposition-90, localPlayer.getY()-120)
			ctx.drawImage(image, playerXposition-86, localPlayer.getY()-110)
		}

		if(bullet) {
			bullet.update();
			bullet.draw(ctx, localPlayer);
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
		shoot: shoot,
		height: height,
		width: width,
		id: id
	}
};