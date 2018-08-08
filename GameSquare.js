class GameSquare {
	constructor(builder) {
		this.owner = builder.owner; // Our owner is a player object
		this.ownerN = builder.ownerN; // OwnerN is 0 for no owner, 1 for playerOne, and 2 for playerTwo
		this.row = builder.row;
		this.col = builder.col;
		this.piece = builder.piece; // We don't have any pieces on us to start
		this.pos = createVector(builder.x, builder.y);
		this.size = builder.size;
		this.r = builder.color.levels[0];
		this.g = builder.color.levels[1];
		this.b = builder.color.levels[2];
		this.inside = false; // Is the mouse inside our square
		this.highlight = false; // Should we highlight the square? Used for highlighting neighbors
		this.neighbors = []; // The legal places we can move to
		this.king = builder.king; // Tells us if we are a king
		this.jumps = []; // Tells us the jumps we can do
		this.mustJump = builder.mustJump; // Tells us if we must jump
		this.displayText = false; // Should we show the board location?
		this.showArrows = false; // Should we show all legal moves?
	}

	static get buildSquare() {
		class Builder {
			constructor() {
				this.owner = null;
				this.ownerN = 0;
				this.piece = null;
				this.size = 80;
				this.king = false;
				this.mustJump = false;
				return this;
			}
			withOwner(owner) {
				this.owner = owner;
				return this;
			}
			withOwnerN(ownerN) {
				this.ownerN = ownerN;
				return this;
			}
			withRow(row) {
				this.row = row;
				return this;
			}
			withColumn(col) {
				this.col = col;
				return this;
			}
			withPos(x, y) {
				this.x = x;
				this.y = y;
				return this;
			}
			withColor(r, g, b) {
				this.color = color(r, g, b);
				return this;
			}
			withPiece(piece) {
				this.piece = piece;
				return this;
			}
			withSize(size) {
				this.size = size;
				return this;
			}
			withKing(bool) {
				this.king = bool;
				return this;
			}
			withMustJump(bool) {
				this.mustJump = bool;
				return this;
			}
			build() {
				return new GameSquare(this);
			}
		}
		return Builder;
	}

	hasPiece() {
		return (this.piece != null);
	}

	copy() {
		let ret = new GameSquare.buildSquare()
			.withOwner(this.owner)
			.withOwnerN(this.ownerN)
			.withRow(this.row)
			.withColumn(this.col)
			.withPos(this.pos.x, this.pos.y)
			.withColor(this.r, this.g, this.b)
			.withPiece(this.piece)
			.withKing(this.king)
			.withMustJump(this.mustJump)
			.build();
		return ret;
	}

	fourNeighbors() {
		let ret = [];
		if (getCurrentPlayer().canAccess(this.row + 1, this.col + 1)) {
			if (board[this.row + 1][this.col + 1].owner === getCurrentPlayer()) {
				ret.push({
					loc: board[this.row + 1][this.col + 1],
					pos: "BOTTOMRIGHT"
				});
			}
		}
		if (getCurrentPlayer().canAccess(this.row - 1, this.col + 1)) {
			if (board[this.row - 1][this.col + 1].owner === getCurrentPlayer()) {
				ret.push({
					loc: board[this.row - 1][this.col + 1],
					pos: "TOPRIGHT"
				});
			}
		}
		if (getCurrentPlayer().canAccess(this.row + 1, this.col - 1)) {
			if (board[this.row + 1][this.col - 1].owner === getCurrentPlayer()) {
				ret.push({
					loc: board[this.row + 1][this.col - 1],
					pos: "BOTTOMLEFT"
				});
			}
		}
		if (getCurrentPlayer().canAccess(this.row - 1, this.col - 1)) {
			if (board[this.row - 1][this.col - 1].owner === getCurrentPlayer()) {
				ret.push({
					loc: board[this.row - 1][this.col - 1],
					pos: "TOPLEFT"
				});
			}
		}
		return ret;
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
		fill(245);
	}
	// Now that the color is figured out, we can draw the square
	rect(this.pos.x, this.pos.y, this.size, this.size);

	if (this.piece) { // Draws a circle if there is a piece there
		fill(this.owner.color);
		ellipse(this.pos.x + this.size / 2, this.pos.y + this.size / 2, this.piece.size, this.piece.size);
	}
	if (this.king) { // Draws a dot in the center of the circle if we are a king
		fill(0);
		ellipse(this.pos.x + this.size / 2, this.pos.y + this.size / 2, 5, 5);
	}
}

GameSquare.prototype.showMoves = function() {
	if (!this.showArrows) return;
	let targets = (this.jumps.length > 0) ? this.jumps : this.neighbors;
	for (let target of targets) {
		drawArrowFromTo(this, target, color(0, 200, 0));
	}
}

GameSquare.prototype.showText = function() {
	if (this.displayText) {
		// Shows the square's row and col number. Used for testing
		fill(255);
		text(this.row + ", " + this.col, this.pos.x + this.size / 2, this.pos.y + this.size / 4);
	}
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
GameSquare.prototype.generateNeighbors = function(board) {
	this.neighbors = []; // Resetting the possible jumps and neighbors
	this.jumps = [];
	if (this.ownerN == 1) { // Player one can move downwards unless they are king
		this.checkMoves(board, this.row, this.col, 1, 1); // Bottom Right
		this.checkMoves(board, this.row, this.col, 1, -1); // Bottom Left
		if (this.king) {
			this.checkMoves(board, this.row, this.col, -1, 1); // Top Right
			this.checkMoves(board, this.row, this.col, -1, -1); // Top Left
		}
	} else if (this.ownerN == 2) { // Player Two can move upwards unless they are a king
		this.checkMoves(board, this.row, this.col, -1, 1);
		this.checkMoves(board, this.row, this.col, -1, -1);
		if (this.king) {
			this.checkMoves(board, this.row, this.col, 1, 1);
			this.checkMoves(board, this.row, this.col, 1, -1);
		}
	}
}

// Checks one of the four neighbors of the square for legal moves
GameSquare.prototype.checkMoves = function(board, row, col, rDir, cDir) {
	if (Player.canAccess(row + rDir, col + cDir)) {
		let targetSpot = board[row + rDir][col + cDir];
		if (targetSpot.owner === null) {
			this.neighbors.push(targetSpot);
		} else if (targetSpot.ownerN !== this.ownerN) {
			rDir = (rDir > 0) ? rDir + 1 : rDir - 1;
			cDir = (cDir > 0) ? cDir + 1 : cDir - 1;
			if (Player.canAccess(row + rDir, col + cDir)) {
				targetSpot = board[row + rDir][col + cDir];
				if (targetSpot.owner === null) {
					this.neighbors.push(targetSpot);
					this.jumps.push(targetSpot);
					if (currentPlayer === this.owner) {
						this.mustJump = true;
					}
				}
			}
		}
	}
}

// Resets the piece to default values
GameSquare.prototype.reset = function() {
	this.owner = null;
	this.ownerN = 0;
	this.piece = null;
	this.king = false;
	this.mustJump = false;
	this.arrows = false;
}