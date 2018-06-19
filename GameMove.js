class GameMove {
	constructor(owner, from, to) {
		this.owner = owner;
		this.from = from;
		this.to = to;
	}

	// Actually doing the move. Mostly transferring instance variables
	doIt() {
		this.to.piece = this.from.piece;
		this.to.owner = this.from.owner;
		this.to.ownerN = this.from.ownerN;
		this.to.mustJump = false;

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

}