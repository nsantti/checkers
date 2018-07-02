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

	canAccess(row, col) {
		if (row >= 0 && row < 8 && col >= 0 && col < 8) {
			return true;
		} else {
			return false;
		}
	}

	// Tells us if the player must jump
	mustJump(board) {
		for (let i = 0; i < board.length; i++) {
			for (let j = 0; j < board[i].length; j++) {
				if (board[i][j].owner == this && board[i][j].mustJump) {
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
		for (let i = 0; i < this.capturedPieces.length; i++) {
			this.capturedPieces[i].show();
		}
	}

	canMove(board) {
		for (let i = 0; i < board.length; i++) {
			for (let j = 0; j < board[i].length; j++) {
				if (board[i][j].owner !== this) {
					continue;
				}
				if (board[i][j].neighbors.length > 0 || board[i][j].jumps.length > 0) {
					return true;
				}
			}
		}
		return false;
	}

	squaresOwned(board) {
		let owned = [];
		for (let i = 0; i < board.length; i++) {
			for (let j = 0; j < board[i].length; j++) {
				if (board[i][j].owner === this) {
					owned.push(board[i][j]);
				}
			}
		}
		return owned;
	}

	getAllMoves() {
		let allMoves = this.squaresOwned(board);
		let theMoves = [];
		if (this.mustJump(board)) {
			for (let move of allMoves) {
				if (move.jumps.length > 0) {
					for (let dest of move.jumps) {
						theMoves.push({
							from: move,
							to: dest,
							score: 0
						});
					}
				}
			}
		} else {
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
		}
		return theMoves;
	}

}