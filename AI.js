class AI extends Player {
	constructor(color, name, weights) {
		super(color, name);
		//[5, -4, -2, 0.5, 1, 0.5, 4] //default weights used for evolving
		this.weights = weights;
		this.results = {
			won: 0,
			lost: 0,
			tie: 0
		};
		this.pMoves = [];
	}

	move() {
		// Get list of all possible moves
		let possibleMoves = this.getAllMoves();
		let otherPlayerMoves = getOtherPlayer().squaresOwned(board);

		// Apply a score to each move
		for (let eachMove of possibleMoves) {
			eachMove.score = this.scoreMove(eachMove.from, eachMove.to, otherPlayerMoves);
		}
		// If we can cover up a potential jump, do it.
		otherPlayerMoves = otherPlayerMoves.filter(square => square.jumps.length > 0);
		// for (let i = 0; i < otherPlayerMoves.length; i++) {
		// 	for (let j = 0; j < otherPlayerMoves[i].jumps.length; j++) {
		// 		for (let k = 0; k < possibleMoves.length; k++) {
		// 			if (possibleMoves[k].to === otherPlayerMoves[i].jumps[j]) {
		// 				possibleMoves[k].score += this.weights[6];
		// 			}
		// 		}
		// 	}
		// }

		for (let otherMoves of otherPlayerMoves) {
			for (let theirJump of otherMoves.jumps) {
				for (let myMove of possibleMoves) {
					if (myMove.to === theirJump) {
						myMove.score += this.weights[6];
					}
				}
			}
		}

		this.pMoves = possibleMoves;

		// Make the move with the highest score
		let theMove = this.getBestMove(possibleMoves);
		makeMove(theMove.from, theMove.to);
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
		for (let neighbor of immediateNeighbors) {
			if (this.willBeJumped(neighbor)) {
				score += this.weights[2];
				safe = false;
			}
		}

		if (safe) {
			if (!from.king && from.row === (getCurrentPlayer() === playerTwo ? 7 : 0)) {
				score += this.weights[3];
			} else if (!from.king) {
				score += this.weights[4];
				if (random() < 0.4) {
					if (getCurrentPlayer() === playerTwo) {
						score += (map(to.row, 0, 7, 0.5, 0));
					} else {
						score += map(to.row, 0, 7, 0, 0.5);
					}
				}
			} else if (to.col < 2 || to.col > 5) {
				score += this.weights[5];
			}
		}
		return score;
	}


	canBeJumped(from, to) {
		let otherOwnerN = getCurrentPlayer() === playerTwo ? 1 : 2;
		// look top squares to see if a jump exists
		// Top left and bottom right
		if (this.canAccess(to.row - 1, to.col - 1) && this.canAccess(to.row + 1, to.col + 1)) {
			let TOPLEFT = board[to.row - 1][to.col - 1];
			let BOTTOMRIGHT = board[to.row + 1][to.col + 1];
			if (getCurrentPlayer() === playerOne) {
				let temp = TOPLEFT;
				TOPLEFT = BOTTOMRIGHT;
				BOTTOMRIGHT = temp;
			}
			if (TOPLEFT.ownerN === otherOwnerN) {
				if (BOTTOMRIGHT.ownerN === 0) {
					return true;
				}
				if (BOTTOMRIGHT === from) {
					return true;
				}
			}
			if (BOTTOMRIGHT.ownerN === otherOwnerN && BOTTOMRIGHT.king) {
				if (TOPLEFT === from || TOPLEFT.ownerN === 0) {
					return true;
				}
			}
		}
		// look at top right and bottom left
		if (this.canAccess(to.row - 1, to.col + 1) && this.canAccess(to.row + 1, to.col - 1)) {
			let TOPRIGHT = board[to.row - 1][to.col + 1];
			let BOTTOMLEFT = board[to.row + 1][to.col - 1];
			if (getCurrentPlayer() === playerOne) {
				let temp = TOPRIGHT;
				TOPRIGHT = BOTTOMLEFT;
				BOTTOMLEFT = temp;
			}
			if (TOPRIGHT.ownerN === otherOwnerN) {
				if (BOTTOMLEFT.ownerN === 0) {
					return true;
				}
				if (BOTTOMLEFT === from) {
					return true;
				}
			}
			if (BOTTOMLEFT.ownerN === otherOwnerN && BOTTOMLEFT.king) {
				if (TOPRIGHT === from || TOPRIGHT.ownerN === 0) {
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
		let otherOwnerN = getCurrentPlayer() === playerTwo ? 1 : 2;

		// Top left
		if (target === "TOPLEFT") {
			if (this.canAccess(row - 1, col - 1)) {
				if (board[row - 1][col - 1].ownerN === otherOwnerN) {
					if (getCurrentPlayer() === playerTwo || board[row - 1][col - 1].king) {
						return true;
					}
				}
			}
		}
		if (target === "TOPRIGHT") {
			if (this.canAccess(row - 1, col + 1)) {
				if (board[row - 1][col + 1].ownerN === otherOwnerN) {
					if (getCurrentPlayer() === playerTwo || board[row - 1][col + 1].king) {
						return true;
					}
				}
			}
		}
		if (target === "BOTTOMLEFT") {
			if (this.canAccess(row + 1, col - 1)) {
				if (board[row + 1][col - 1].ownerN === otherOwnerN) {
					if (getCurrentPlayer() === playerOne || board[row + 1][col - 1].king) {
						return true;
					}
				}
			}
		}
		if (target === "BOTTOMRIGHT") {
			if (this.canAccess(row + 1, col + 1)) {
				if (board[row + 1][col + 1].ownerN === otherOwnerN) {
					if (getCurrentPlayer() === playerOne || board[row + 1][col + 1].king) {
						return true;
					}
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
			if (getCurrentPlayer() === playerTwo) {
				if (board[row - 1][col - 1].ownerN === 1 && board[row + 1][col + 1].ownerN === 0) {
					return true;
				} else if (board[row + 1][col + 1].ownerN === 1 && board[row + 1][col + 1].king && board[row - 1][col - 1].ownerN === 0) {
					return true;
				}
			} else if (getCurrentPlayer() == playerOne) {
				if (board[row - 1][col - 1].ownerN === 2 && board[row - 1][col - 1].king && board[row + 1][col + 1].ownerN === 0) {
					return true;
				} else if (board[row + 1][col + 1].ownerN === 2 && board[row - 1][col - 1].ownerN === 0) {
					return true;
				}
			}

		}

		if (this.canAccess(row - 1, col + 1) && this.canAccess(row + 1, col - 1)) {
			if (getCurrentPlayer() === playerTwo) {
				if (board[row - 1][col + 1].ownerN === 1 && board[row + 1][col - 1].ownerN === 0) {
					return true;
				} else if (board[row + 1][col - 1].ownerN === 1 && board[row + 1][col - 1].king && board[row - 1][col + 1].ownerN === 0) {
					return true;
				}
			} else if (getCurrentPlayer() === playerOne) {
				if (board[row - 1][col + 1].ownerN === 2 && board[row - 1][col + 1].king && board[row + 1][col - 1].ownerN === 0) {
					return true;
				} else if (board[row + 1][col - 1].ownerN === 2 && board[row - 1][col + 1].ownerN === 0) {
					return true;
				}
			}

		}
		return false;
	}

	getBestMove(arr) {
		let highest = -100000;

		for (let move of arr) {
			if (move.score > highest) {
				highest = move.score;
			}
		}

		let potentialMoves = [];
		for (let move of arr) {
			if (move.score === highest) {
				potentialMoves.push(move);
			}
		}
		return random(potentialMoves);
	}


}