/**************************************************
** GAME PLAYER CLASS
**************************************************/
var Player = function(startX, startY) {
	var x = startX,
		y = startY,
		id,
		dead = false,
		objectId = "",
		maxX = 0,
		minX = 0,
		moveAmount = 0,
		objectsCount = 0,
		objectsFixed = 0,
		playersShotPoints = 0;

	// Getters and setters
	var getX = function() {
		return x;
	};

	var getY = function() {
		return y;
	};

	var getExploration = function() {
		return Math.abs(minX) + maxX; 
	};

	var getMoveAmount = function() {
		return moveAmount; 
	};

	var setX = function(newX) {
		if(x>maxX) {
			maxX = x;
		} else if(x<minX) {
			minX = x;
		}

		moveAmount += Math.abs(newX-x);

		x = newX;
	};

	var setY = function(newY) {
		moveAmount += Math.abs(newY-y);

		y = newY;
	};

	// Define which variables and methods can be accessed
	return {
		getX: getX,
		getY: getY,
		getExploration: getExploration,
		getMoveAmount: getMoveAmount,
		setX: setX,
		setY: setY,
		id: id,
		dead: dead,
		objectId: objectId,
		objectsCount: objectsCount,
		objectsFixed: objectsFixed,
		playersShotPoints: playersShotPoints
	}
};

// Export the Player class so you can use it in
// other files by using require("Player").Player
exports.Player = Player;