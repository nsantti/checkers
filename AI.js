class AI extends Player {
	constructor(color) {
		super(color, "Computer");
	}

	move() {
		// Get list of all possible moves
		let possibleMoves = this.getAllMoves();

		// Apply a score to each move
		for (let eachMove of possibleMoves) {
			eachMove.score = this.scoreMove(eachMove.from, eachMove.to);
		}
		console.log(possibleMoves);
		// Make the move with the highest score
		let theMove = this.getBestMove(possibleMoves);
		makeMove(theMove.from, theMove.to);
	}

	scoreMove(from, to) {
		let score = 0;
		let immediateNeighbors = from.fourNeighbors();
		let safe = true;
		// Is the piece in danger of being jumped?
		if (this.canAlreadyBeJumped(from)) {
			safe = false;
			score += 1;
		}
		// Will this piece be jumped if it moves?
		if (this.canBeJumped(from, to)) {
			score -= 4;
			safe = false;
		}
		// Will another piece be jumped if this moves?
		for (let i = 0; i < immediateNeighbors.length; i++) {
			if (this.willBeJumped(immediateNeighbors[i])) {
				score -= 2;
				safe = false;
			}
		}
		if (safe) {
			if (!from.king) {
				score += 1.5;
			} else if (to.col < 2 || to.col > 5) {
				score += 1;
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
			if (TOPLEFT.ownerN === 1) {
				if (BOTTOMRIGHT.ownerN === 0) {
					return true;
				}
				if (BOTTOMRIGHT === from) {
					return true;
				}
			}
			if (BOTTOMRIGHT.ownerN === 1 && BOTTOMRIGHT.king) {
				if (TOPLEFT.ownerN === 0) {
					return true;
				}
			}
		}
		// look at top right and bottom left
		if (this.canAccess(to.row - 1, to.col + 1) && this.canAccess(to.row + 1, to.col - 1)) {
			let TOPRIGHT = board[to.row - 1][to.col + 1];
			let BOTTOMLEFT = board[to.row + 1][to.col - 1];
			if (TOPRIGHT.ownerN === 1) {
				if (BOTTOMLEFT.ownerN === 0) {
					return true;
				}
				if (BOTTOMLEFT === from) {
					return true;
				}
			}
			if (BOTTOMLEFT.ownerN === 1 && BOTTOMLEFT.king) {
				if (TOPRIGHT.ownerN === 0) {
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
				if (board[row - 1][col - 1].ownerN === 1) {
					return true;
				}
			}
		}
		if (target === "TOPRIGHT") {
			if (this.canAccess(row - 1, col + 1)) {
				if (board[row - 1][col + 1].ownerN === 1) {
					return true;
				}
			}
		}
		if (target === "BOTTOMLEFT") {
			if (this.canAccess(row + 1, col - 1)) {
				if (board[row + 1][col - 1].ownerN === 1 && board[row + 1][col - 1].king) {
					return true;
				}
			}
		}
		if (target === "BOTTOMRIGHT") {
			if (this.canAccess(row + 1, col + 1)) {
				if (board[row + 1][col + 1].ownerN === 1 && board[row + 1][col + 1].king) {
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
		if (row - 1 >= 0 && col - 1 >= 0 && row + 1 < 8 && col + 1 < 8) {
			if (board[row - 1][col - 1].ownerN === 1 && board[row + 1][col + 1].ownerN === 0) {
				return true;
			} else if (board[row + 1][col + 1].ownerN === 1 && board[row + 1][col + 1].king && board[row - 1][col - 1].ownerN === 0) {
				return true;
			}
		}

		if (row - 1 >= 0 && col + 1 < 8 && row + 1 < 8 && col - 1 >= 0) {
			if (board[row - 1][col + 1].ownerN === 1 && board[row + 1][col - 1].ownerN === 0) {
				return true;
			} else if (board[row + 1][col - 1].ownerN === 1 && board[row + 1][col - 1].king && board[row - 1][col + 1].ownerN === 0) {
				return true;
			}
		}
		return false;
	}

	getBestMove(arr) {
		let highest = -100000;
		for (let i = 0; i < arr.length; i++) {
			if (arr[i].score > highest) {
				highest = arr[i].score;
			}
		}

		let potentialMoves = [];
		for (let i = 0; i < arr.length; i++) {
			if (arr[i].score === highest) {
				potentialMoves.push(arr[i]);
			}
		}


		return random(potentialMoves);
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