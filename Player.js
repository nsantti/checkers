class Player {
	constructor(color, name) {
		this.pieces = []; // The pieces it current has
		this.moves = []; // All the moves the player has taken
		this.color = color; // What the player color is
		this.won = undefined; // If the player won
		this.justJumped = false; // If they player just jumped, they need to jump again if possible
		this.name = name; // What is the player's name?
		this.capturedPieces = []; // A list of pieces the player has captured
	}

	canAccess(row, col) { // I know I can make this one line. I had console.logs for true or false
		if (row >= 0 && row < 8 && col >= 0 && col < 8) {
			return true;
		} else {
			return false;
		}
	}

	static canAccess(row, col) {
		return (row >= 0 && row < 8 && col >= 0 && col < 8);
	}

	// Tells us if the player must jump
	mustJump(board) {
		for (let row of board) {
			for (let square of row) {
				if (square.owner === this && square.mustJump) {
					return true;
				}
			}
		}
		return false;
	}

	// Add a captured piece to the list
	addCaptured(king) {
		this.capturedPieces.push(new SidePiece(getOtherPlayer().color, this.capturedPieces.length, king, this));
	}

	removeCaptured() {
		return this.capturedPieces.pop();
	}

	// Draws all of the captured pieces
	drawCaptured() {
		for (let captured of this.capturedPieces) {
			captured.show();
		}
	}

	canMove(board) {
		for (let row of board) {
			for (let square of row) {
				if (square.owner !== this) {
					continue;
				}
				if (square.neighbors.length > 0 || square.jumps.length > 0) {
					return true;
				}
			}
		}
		return false;
	}

	squaresOwned(board) {
		let owned = [];
		for (let row of board) {
			for (let square of row) {
				if (square.owner === this) {
					owned.push(square);
				}
			}
		}
		return owned;
	}

	getAllMoves() {
		let allMoves = this.squaresOwned(board);
		let theMoves = [];
		// Adding all possible moves to the list
		for (let move of allMoves) {
			if (move.neighbors.length > 0) {
				for (let dest of move.neighbors) {
					theMoves.push({
						from: move,
						to: dest,
						score: 0
					});
				}
			}
		}
		// If we have to jump, only keep the jumping moves
		if (this.mustJump(board)) {
			theMoves = theMoves.filter(x => abs((x.from.row - x.to.row)) > 1);
		}
		return theMoves;
	}

}