class GameSquare {
	constructor(owner, ownerN, i, j, x, y, r, g, b) {
		this.owner = owner; // Our owner is a player object
		this.ownerN = ownerN; // OwnerN is 0 for no owner, 1 for playerOne, and 2 for playerTwo
		this.row = i;
		this.col = j;
		this.piece = null; // We don't have any pieces on us to start
		this.pos = createVector(x, y);
		this.size = 80;
		this.r = r;
		this.g = g;
		this.b = b;
		this.inside = false; // Is the mouse inside our square
		this.highlight = false; // Should we highlight the square? Used for highlighting neighbors
		this.neighbors = []; // The legal places we can move to
		this.king = false; // Tells us if we are a king
		this.jumps = []; // Tells us the jumps we can do
		this.mustJump = false; // Tells us if we must jump
	}
	hasPiece() {
		return (this.piece != null);
	}
}


GameSquare.prototype.show = function() {
	// Increase brightness if we are inside the square
	if (this.inside) {
		fill(this.r + 40, this.g + 40, this.b + 40);
	} else {
		fill(this.r, this.g, this.b);
	}
	// Make the square light green if we are looking at its moves and
	// inside one of the moves. Otherwise make it green if we are looking at moves
	if (this.highlight && this.inside) {
		fill(0, 220, 30);
	} else if (this.highlight) {
		fill(0, 201, 10);
	}
	if (this.mustJump) { // Make the square white if they must jump
		fill(255, 255, 255);
	}
	// Now that the color is figured out, we can draw the square
	rect(this.pos.x, this.pos.y, this.size, this.size);

	if (this.piece) { // Draws a circle if there is a piece there
		fill(this.owner.color);
		ellipse(this.pos.x + this.size / 2, this.pos.y + this.size / 2, 30, 30);
	}
	if (this.king) { // Draws a dot in the center of the circle if we are a king
		fill(0);
		ellipse(this.pos.x + this.size / 2, this.pos.y + this.size / 2, 5, 5);
	}
}

GameSquare.prototype.showText = function() {
	// Shows the square's row and col number. Used for testing
	fill(255);
	text(this.row + ", " + this.col, this.pos.x + 15, this.pos.y + 20);
}

GameSquare.prototype.checkInside = function(x, y) {
	// Lets us know if the mouse is currently inside the square
	if (x > this.pos.x && x < this.pos.x + this.size &&
		y > this.pos.y && y < this.pos.y + this.size) {
		this.inside = true;
		return true;
	} else {
		this.inside = false;
		return false;
	}
}

// Add a piece to the square
GameSquare.prototype.addPiece = function(piece) {
	this.piece = piece;
}

// Generating all legal moves for a square
GameSquare.prototype.generateNeighbors = function(board, mustJump) {
	this.neighbors = []; // Resetting the possible jumps and neighbors
	this.jumps = [];
	if (this.ownerN == 1) { // Player one can move downwards unless they are king
		this.checkUpper(board, this.row, this.col, this.king, mustJump);
		this.checkLower(board, this.row, this.col, true, mustJump);
	} else if (this.ownerN == 2) { // Player Two can move upwards unless they are a king
		this.checkUpper(board, this.row, this.col, true, mustJump);
		this.checkLower(board, this.row, this.col, this.king, mustJump);
	}
}

// Checking the top two moves
GameSquare.prototype.checkUpper = function(board, row, col, canAccess, mustJump) {
	if (canAccess) {
		// Check top left.
		if (row > 0 && col > 0) { // Can we look at this spot on the board?
			if (board[row - 1][col - 1].owner == null) { // If it is empty, add to Array
				this.neighbors.push(board[row - 1][col - 1]);
			} else if (board[row - 1][col - 1].ownerN != this.ownerN) { //If it is taken, and not us, check for a jump
				if (row - 2 >= 0 && col - 2 >= 0) {
					if (board[row - 2][col - 2].owner == null) {
						this.neighbors.push(board[row - 2][col - 2]);
						this.jumps.push(board[row - 2][col - 2]);
						if (currentPlayer == this.owner) {
							this.mustJump = true;
						}
					}
				}
			}
		}
		// Check top right.
		if (row > 0 && col < 7) {
			if (board[row - 1][col + 1].owner == null) {
				this.neighbors.push(board[row - 1][col + 1]);
			} else if (board[row - 1][col + 1].ownerN != this.ownerN) {
				if (row - 2 >= 0 && col + 2 <= 7) {
					if (board[row - 2][col + 2].owner == null) {
						this.neighbors.push(board[row - 2][col + 2]);
						this.jumps.push(board[row - 2][col + 2]);
						if (currentPlayer == this.owner) {
							this.mustJump = true;
						}
					}
				}
			}
		}
	}
}

// Checking the lower two moves
GameSquare.prototype.checkLower = function(board, row, col, canAccess, mustJump) {
	if (canAccess) {
		// Check lower left.
		if (row < 7 && col > 0) {
			if (board[row + 1][col - 1].owner == null) { // If it is empty, add to Array
				this.neighbors.push(board[row + 1][col - 1]);
			} else if (board[row + 1][col - 1].ownerN != this.ownerN) { // If it is taken, and not us, check for a jump
				if (row + 2 <= 7 && col - 2 >= 0) {
					if (board[row + 2][col - 2].owner == null) {
						this.neighbors.push(board[row + 2][col - 2]);
						this.jumps.push(board[row + 2][col - 2]);
						if (currentPlayer == this.owner) {
							this.mustJump = true;
						}
					}
				}
			}
		}
		// Check lower right.
		if (row < 7 && col < 7) {
			if (board[row + 1][col + 1].owner == null) {
				this.neighbors.push(board[row + 1][col + 1]);
			} else if (board[row + 1][col + 1].ownerN != this.ownerN) {
				if (row + 2 <= 7 && col + 2 <= 7) {
					if (board[row + 2][col + 2].owner == null) {
						this.neighbors.push(board[row + 2][col + 2]);
						this.jumps.push(board[row + 2][col + 2]);
						if (currentPlayer == this.owner) {
							this.mustJump = true;
						}
					}
				}
			}
		}
	}
}

GameSquare.prototype.reset = function() {
	this.owner = null;
	this.ownerN = 0;
	this.piece = null;
	this.king = false;
	this.mustJump = false;
}

// Will highlight each neighbor of a particular square
GameSquare.prototype.highlightNeighbors = function() {
	for (var i = 0; i < this.neighbors.length; i++) {
		this.neighbors[i].highlightSquare();
	}
}

GameSquare.prototype.highLightJumps = function() {
	for (let i = 0; i < this.jumps.length; i++) {
		this.jumps[i].highlightSquare();
	}
}

GameSquare.prototype.unHighlightNeighbors = function() {
	for (var i = 0; i < this.neighbors.length; i++) {
		this.neighbors[i].unHighlightSquare();
	}
}

GameSquare.prototype.unHighLightJumps = function() {
	for (let i = 0; i < this.jumps.length; i++) {
		this.jumps[i].unHighlightSquare();
	}
}

GameSquare.prototype.highlightSquare = function() {
	this.highlight = true;
}

GameSquare.prototype.unHighlightSquare = function() {
	this.highlight = false;
}