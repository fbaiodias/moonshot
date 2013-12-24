/**************************************************
** GAME Rope CLASS
**************************************************/
var Rope = function(startX, startY) {
	var x = startX,
		y = startY,
		onPlayer = false,
		used = false,
		id;

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



	// Define which variables and methods can be accessed
	return {
		getX: getX,
		getY: getY,
		isOnPlayer: isOnPlayer,
		setX: setX,
		setY: setY,
		setOn: setOn,
		id: id,
		used: used,
		onPlayer: onPlayer
	}
};

// Export the Player class so you can use it in
// other files by using require("Player").Player
exports.Rope = Rope;