/**************************************************
** GAME PLAYER CLASS
**************************************************/
var Player = function(startX, startY) {
	var x = startX,
		y = startY,
		id,
		moveAmount = 10,
		frame0,
		frame1,
		frame = 0,
		cont = 0; 
	
    frame0 = new Image();
    frame1 = new Image();
	
	frame0.src = "images/astronaut1.png";
	frame1.src = "images/astronaut2.png"; 

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

	// Update player position
	var update = function(keys) {
		// Previous position
		var prevX = x,
			prevY = y;

		// Up key takes priority over down
		if (keys.up) {
			y -= moveAmount;
		} else if (keys.down) {
			y += moveAmount;
		};

		// Left key takes priority over right
		if (keys.left) {
			x -= moveAmount;
		} else if (keys.right) {
			x += moveAmount;
		};

		if (prevX != x || prevY != y){
			if (frame == 1){
				cont ++
				if ( cont == 5){
					frame = 0
					cont = 0
				}
				
			}
			else{
				cont ++
				if ( cont == 5){
					frame = 1
					cont = 0
				}
			}
		}
		return (prevX != x || prevY != y) ? true : false;
	};

	// Draw player
	var draw = function(ctx) {
		var imageX = 100-frame0.width/2,
			imageY = y-frame0.height/2;

		if (frame == 1){
			ctx.drawImage(frame0, imageX, imageY)
		}
		else{
			ctx.drawImage(frame1, imageX, imageY)

		}
	};

	// Draw player
	var drawAsRemote = function(ctx, localPlayer) {

		var imageX = 100-(localPlayer.getX()-x)-frame0.width/2,
			imageY = y-frame0.height/2;

		if (frame == 1){
			ctx.drawImage(frame0, imageX, imageY)
		}
		else{
			ctx.drawImage(frame1, imageX, imageY)

		}
	};

	// Define which variables and methods can be accessed
	return {
		getX: getX,
		getY: getY,
		setX: setX,
		setY: setY,
		update: update,
		draw: draw,
		drawAsRemote: drawAsRemote
	}
};