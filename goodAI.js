class goodAI extends AI {
	constructor(color, name, weights) {
		super(color, name);
		//[5, -4, -2, 0.5, 1, 0.5] default weights

	}



	scoreMove(from, to, arr) {
		let score = 0;
		let immediateNeighbors = from.fourNeighbors();
		let safe = true;



		// Is the piece in danger of being jumped?
		if (this.canAlreadyBeJumped(from)) {
			safe = false;
			score += this.weights[0];
		}
		// Will this piece be jumped if it moves?
		if (this.canBeJumped(from, to)) {
			score += this.weights[1];
			safe = false;
		}
		// Will another piece be jumped if this moves?
		for (let i = 0; i < immediateNeighbors.length; i++) {
			if (this.willBeJumped(immediateNeighbors[i])) {
				score += this.weights[2];
				safe = false;
			}
		}

		if (safe) {
			if (!from.king && from.row === 0) {
				score += this.weights[3];
			} else if (!from.king) {
				score += this.weights[4];
			} else if (to.col < 2 || to.col > 5) {
				score += this.weights[5];
			}
		}
		return score;
	}


	canBeJumped(from, to) {
		// look top squares to see if a jump exists
		// Top left and bottom right
		if (this.canAccess(to.row - 1, to.col - 1) && this.canAccess(to.row + 1, to.col + 1)) {
			let TOPLEFT = board[to.row - 1][to.col - 1];
			let BOTTOMRIGHT = board[to.row + 1][to.col + 1];
			if (BOTTOMRIGHT.ownerN === 2) {
				if (TOPLEFT.ownerN === 0) {
					return true;
				}
				if (TOPLEFT === from) {
					return true;
				}
			}
			if (TOPLEFT.ownerN === 2 && TOPLEFT.king) {
				if (BOTTOMRIGHT === from || BOTTOMRIGHT.ownerN === 0) {
					return true;
				}
			}
		}
		// look at top right and bottom left
		if (this.canAccess(to.row - 1, to.col + 1) && this.canAccess(to.row + 1, to.col - 1)) {
			let TOPRIGHT = board[to.row - 1][to.col + 1];
			let BOTTOMLEFT = board[to.row + 1][to.col - 1];
			if (BOTTOMLEFT.ownerN === 2) {
				if (TOPRIGHT.ownerN === 0) {
					return true;
				}
				if (TOPRIGHT === from) {
					return true;
				}
			}
			if (TOPRIGHT.ownerN === 2 && TOPRIGHT.king) {
				if (BOTTOMLEFT === from || BOTTOMLEFT.ownerN === 0) {
					return true;
				}
			}
		}
		return false;
	}

	willBeJumped(square) {
		let row = square.loc.row;
		let col = square.loc.col;
		let target = square.pos;
		// Top left
		if (target === "TOPLEFT") {
			if (this.canAccess(row - 1, col - 1)) {
				if (board[row - 1][col - 1].ownerN === 2 && board[row - 1][col - 1].king) {
					return true;
				}
			}
		}
		if (target === "TOPRIGHT") {
			if (this.canAccess(row - 1, col + 1)) {
				if (board[row - 1][col + 1].ownerN === 2 && board[row - 1][col + 1].king) {
					return true;
				}
			}
		}
		if (target === "BOTTOMLEFT") {
			if (this.canAccess(row + 1, col - 1)) {
				if (board[row + 1][col - 1].ownerN === 2) {
					return true;
				}
			}
		}
		if (target === "BOTTOMRIGHT") {
			if (this.canAccess(row + 1, col + 1)) {
				if (board[row + 1][col + 1].ownerN === 2) {
					return true;
				}
			}
		}
		return false;
	}

	canAlreadyBeJumped(from) {
		let row = from.row;
		let col = from.col;
		// Top left to bottom right jump or bottom right to top left
		if (this.canAccess(row - 1, col - 1) && this.canAccess(row + 1, col + 1)) {
			if (board[row - 1][col - 1].ownerN === 2 && board[row - 1][col - 1].king && board[row + 1][col + 1].ownerN === 0) {
				return true;
			} else if (board[row + 1][col + 1].ownerN === 2 && board[row - 1][col - 1].ownerN === 0) {
				return true;
			}
		}

		if (this.canAccess(row - 1, col + 1) && this.canAccess(row + 1, col - 1)) {
			if (board[row - 1][col + 1].ownerN === 2 && board[row - 1][col + 1].king && board[row + 1][col - 1].ownerN === 0) {
				return true;
			} else if (board[row + 1][col - 1].ownerN === 2 && board[row - 1][col + 1].ownerN === 0) {
				return true;
			}
		}
		return false;
	}




}