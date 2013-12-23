/**************************************************
** GAME Ravina CLASS
**************************************************/
var Ravine = function(startX, startY) {
	var x = startX,
		y = startY,
		onPlayer = false,
		rocketEnd,
		rocketGo,
		coco = false,
		go = false,
		up = 0,
		id;

	ravine = new Image();
	ravineRope = new Image();
	ravine.src = "images/ravine.png";
	ravineRope.src = "images/ravineRope.png";

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
		var imageX = playerXposition-(localPlayer.getX()-x)-ravine.width/2,
			imageY = canvas.height-600-up;
			console.log(this.coco)
		if (this.coco == false){
			console.log("pio")
			ctx.drawImage(ravine, imageX, imageY);
			ctx.font="Bold 30px Courier";
  			ctx.strokeStyle = 'black';
    		ctx.lineWidth = 8;
  			ctx.fillStyle = "rgb(25,243,50)";
  			ctx.strokeText("Press X to tie the rope!",canvas.width/2-215,150);
  			ctx.fillText("Press X to tie the rope!",canvas.width/2-215,150);
		}
		else{
			ctx.drawImage(ravineRope, imageX, imageY);
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
		coco: coco,
		go: go,
		id: id
	}
};