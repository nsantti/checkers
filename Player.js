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
		this.capturedPieces.push(new SidePiece(getOtherPlayer().color, this.capturedPieces.length, king, currentPlayer));
	}

	// Draws all of the captured pieces
	drawCaptured() {
		for (let i = 0; i < this.capturedPieces.length; i++) {
			this.capturedPieces[i].show();
		}
	}

}