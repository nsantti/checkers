class GameMove {
	constructor(owner, from, to) {
		this.owner = owner;
		this.from = from;
		this.to = to;
		this.fromCopy = from.copy();
		this.toCopy = to.copy();
	}

	// Actually doing the move. Mostly transferring instance variables
	doIt() {
		this.to.piece = this.from.piece;
		this.to.owner = this.from.owner;
		this.to.ownerN = this.from.ownerN;
		this.to.mustJump = false;
		this.to.showArrows = false;

		this.checkForKing();

		// Making the from square empty
		this.from.reset();
	}

	checkForKing() {
		// Handles if the piece should be a king after the jump
		if (!this.from.king) {
			if ((this.to.row === 7 && this.from.ownerN === 1) ||
				(this.to.row === 0 && this.from.ownerN === 2)) {
				this.to.king = true;
			}
		} else {
			this.to.king = this.from.king;
		}
	}

	undoIt() {
		this.to.reset();
		this.transferVariables(this.from, this.fromCopy);
		this.transferVariables(this.to, this.toCopy);
		// If the move jumped a piece, figure out who it belonged to.
		// Get rid of it from the side board
		// Remember if it was a king or not
		if (jumpedAPiece(this)) {
			let square = JUMPEDPIECES.pop();
			let theOwner = (this.from.owner === playerOne) ? playerTwo : playerOne;
			let otherOwner = (theOwner === playerOne) ? playerTwo : playerOne;
			square.owner = theOwner;
			square.ownerN = (theOwner === playerOne) ? 1 : 2;
			square.piece = new GamePiece(theOwner);
			let isKing = otherOwner.removeCaptured();
			square.king = isKing.king;
			theOwner.pieces.push(square.piece);

		}

	}

	transferVariables(f, t) {
		f.owner = t.owner;
		f.ownerN = t.ownerN;
		f.row = t.row;
		f.col = t.col;
		f.piece = t.piece;
		f.pos.x = t.pos.x;
		f.pos.y = t.pos.y;
		f.size = t.size;
		f.r = t.r;
		f.g = t.g;
		f.b = t.b;
		f.king = t.king;
		f.mustJump = t.mustJump;
	}

}