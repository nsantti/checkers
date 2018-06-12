function drawBoard() { // Draw the board. Comment out the 'showText' part if you don't want grid numbers
	for (let i = 0; i < cols; i++) {
		for (let j = 0; j < rows; j++) {
			board[i][j].show();
			//board[i][j].showText();
			board[i][j].checkInside(mouseX, mouseY);
		}
	}
}

function drawPlayerTurn() { // Draws the player's turn at the bottom of the screen
	textSize(20);
	fill(255);
	textAlign(CENTER);
	if (!gameOver) {
		let player = (currentPlayer == playerOne) ? playerOne.name : playerTwo.name;
		text(player + "\'s Turn", width / 2, height - 10);
	} else {
		let winner = (playerOne.won == true) ? playerOne.name : playerTwo.name;
		text("Game Over, " + winner + " Won", width / 2, height - 10);
	}

	textAlign(CENTER);
	text(playerOne.name, (width - (8 * w)) - 50, height - 45);
	text(playerTwo.name, width - (width - (8 * w)), height - 45);
	// Draw the piece next to each player
	fill(playerOne.color);
	ellipse((width - (8 * w)) + playerOne.name.length + 20, height - 50, 30);
	fill(playerTwo.color);
	ellipse(width - (width - (8 * w)) + playerTwo.name.length + 70, height - 50, 30);
}

function drawArrow() { // Draws the arrow to show previous turn
	if (moves.length === 0) return;
	// Figure out how many arrows to draw
	let startingPoint = 0;
	for (let i = moves.length - 1; i >= 0; i--) {
		if (moves[moves.length - 1].owner == moves[i].owner) {
			startingPoint++;
		} else {
			break;
		}
	}
	for (let i = moves.length - startingPoint; i < moves.length; i++) {
		let move = moves[i];
		let offset = 7 / 5;
		let arrowSize = 7;
		let numRotates = 0;
		push();
		translate(move.from.pos.x + move.from.size / 2, move.from.pos.y + move.from.size / 2);
		stroke(255);
		rotate(PI / 4); // Default rotation to bottom left
		// Figure out how many more rotations to do
		if (move.to.row < move.from.row && move.to.col < move.from.col) {
			numRotates = 1;
		} else if (move.to.row < move.from.row && move.to.col > move.from.col) {
			numRotates = 2;
		} else if (move.to.row > move.from.row && move.to.col > move.from.col) {
			numRotates = 3;
		}
		// Rotate until we are looking at the correct square
		for (let i = 0; i < numRotates; i++) {
			rotate(PI / 2);
		}
		let moveSize = move.from.size * offset * (abs(move.to.col - move.from.col) == 2 ? 2 : 1);
		// Drawing the arrow
		strokeWeight(2);
		line(0, 0, 0, moveSize);
		line(0, moveSize, -arrowSize, moveSize - arrowSize);
		line(0, moveSize, arrowSize, moveSize - arrowSize);
		pop();
	}
}

function showAllP1Moves() {
	// Shows all legal moves for a player
	let hasToJump = playerOne.mustJump(board);

	for (let i = 0; i < board[0].length; i++) {
		for (let j = 0; j < board.length; j++) {
			if (board[i][j].hasPiece() && board[i][j].owner == playerOne) {
				if (hasToJump) {
					board[i][j].highLightJumps();
				} else {
					board[i][j].highlightNeighbors();
				}
			}
		}
	}
}

function hideAllMoves() {
	// Hides all legal moves for a player
	for (let i = 0; i < board[0].length; i++) {
		for (let j = 0; j < board.length; j++) {
			if (board[i][j].hasPiece()) {
				board[i][j].unHighlightNeighbors();
			}
		}
	}
}

function showAllP2Moves() {
	// Shows all legal moves for a player
	let hasToJump = playerTwo.mustJump(board);
	for (let i = 0; i < board[0].length; i++) {
		for (let j = 0; j < board.length; j++) {
			if (board[i][j].hasPiece() && board[i][j].owner == playerTwo) {
				if (hasToJump) {
					board[i][j].highLightJumps();
				} else {
					board[i][j].highlightNeighbors();
				}
			}
		}
	}
}

// Draws the captured pieces
function drawCapturedPieces() {
	playerOne.drawCaptured();
	playerTwo.drawCaptured();
}



// EOF