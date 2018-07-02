let playAgain; // Button to play again the game is over
let mainMenu; // Button to return to the main menu when the game is over
let endingButtons; // Data structure to hold the ending buttons
let counter; // My own framerate variable

function initVariables() {
	counter = 0;
	endingButtons = [];
	endingButtons.push(playAgain = new NButton("Play Again", width - (8 * w) + w / 2, h + 75 * 6, 120, 55, true));
	endingButtons.push(mainMenu = new NButton("Main Menu", width - (4 * w), h + 75 * 6, 120, 55, true));
}

function draw() {

	background(50);
	if (GAMESTATE === MAINMENU) {
		drawStartScreen();
	} else if (GAMESTATE === PREGAME || GAMESTATE === PREGAMEAI) {
		drawPreGame();
	} else {
		if (!simulate) {
			drawBoard();
			drawArrow();
			drawArrowMoves();
			drawCapturedPieces();
			drawButtons(liveButtons);
		}

		drawPlayerTurn();

		if (frameCount % 1 === 0 && !gameOver && watchComputerPlay) {
			makeRandomMove();
		}
		if (simulate) {
			if (gameCount % 10 === 0 && moves.length < 2) {
				console.log(results);

			}
			if (gameOver && gameCount > 0 && gameCount % populationSize === 0) {
				populationIndex++;
				if (populationIndex === population.length) {
					noLoop();
					console.log(population);
					return;
				}


			}
			if (gameOver) {
				reset(mainBoard, playerOne.color, playerTwo.color, PLAYINGGAME, aiPlaying);
			} else {
				getCurrentPlayer().move();
			}
		}


		if (getCurrentPlayer() === playerTwo) {
			counter++;
			if (!gameOver && counter > (simulate ? 0 : 60) && typeof getCurrentPlayer().move !== 'undefined' && !watchComputerPlay) {
				getCurrentPlayer().move();
				counter = 0;
			}
		} else if (simulate && !gameOver && getCurrentPlayer() === playerOne) {
			makeRandomMove();
		}



	}


}


function drawArrowMoves() {
	for (let i = 0; i < cols; i++) {
		for (let j = 0; j < rows; j++) {
			board[i][j].showMoves();
		}
	}
}

function drawBoard() { // Draw the board
	for (let i = 0; i < cols; i++) {
		for (let j = 0; j < rows; j++) {
			board[i][j].show();
			board[i][j].showText();
			if (!gameOver) {
				board[i][j].checkInside(mouseX, mouseY);
			}
		}
	}
}

// Draws all of the buttons
function drawButtons(anArray) {
	for (let i = 0; i < anArray.length; i++) {
		anArray[i].show();
		anArray[i].isInside(mouseX, mouseY);
	}
}

function drawPlayerTurn() { // Draws the player's turn at the bottom of the screen
	push();
	textSize(20);
	fill(255);
	textAlign(CENTER);
	if (!gameOver) {
		let player = getCurrentPlayer().name;
		text(player + "\'s Turn", width / 2, height - 10);
	} else {
		endingButtons.map(theBut => theBut.hide = false);
		drawEndingScreen();
	}

	text(playerOne.name, (width - (8 * w)) - 50, height - 45);
	text(playerTwo.name, width - (width - (8 * w)), height - 45);
	// Draw the piece next to each player
	fill(playerOne.color);
	ellipse((width - (8 * w)) + playerOne.name.length + 20, height - 50, 30);
	fill(playerTwo.color);
	ellipse(width - (width - (8 * w)) + playerTwo.name.length + 70, height - 50, 30);
	pop();
}

function drawEndingScreen() {
	push();
	fill(50, 225);
	stroke(255);
	rect(width - (8 * w), h + 75, width / 2 + w, height / 2 + h);
	let message = "Game Over, ";
	if (playerOne.won) {
		message += playerOne.name + " Won!";
		population[populationIndex].results.lost += 1;
		results.lost++;
	} else if (playerTwo.won) {
		message += playerTwo.name + " Won!";
		population[populationIndex].results.won += 1;
		results.won++;
	} else {
		message += "TIE!";
		population[populationIndex].results.tie += 1;
		results.tie++;
	}
	noStroke();
	fill(255);
	textSize(30);

	text(message, width / 2, h + 75 * 2);

	textSize(24);
	textAlign(LEFT);
	text("Total Moves: " + moves.length, width / 2 - w * 2.5, h + 75 * 3);
	text(playerOne.name + " pieces lost: " + playerTwo.capturedPieces.length, width / 2 - w * 2.5, h + 75 * 4);
	text(playerTwo.name + " pieces lost: " + playerOne.capturedPieces.length, width / 2 - w * 2.5, h + 75 * 5);
	if (!simulate) {
		drawButtons(endingButtons);

	}
	pop();
	if (simulate) {
		gameCount++;

	}

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
		drawArrowFromTo(moves[i].from, moves[i].to);
	}
}

// Draws the arrow with a given from and to location
function drawArrowFromTo(from, to, col = color(255)) {
	let offset = 7 / 5;
	let arrowSize = 7;
	let numRotates = 0;
	push();
	translate(from.pos.x + from.size / 2, from.pos.y + from.size / 2);
	stroke(col);
	rotate(PI / 4); // Default rotation to bottom left
	// Figure out how many more rotations to do
	if (to.row < from.row && to.col < from.col) {
		numRotates = 1;
	} else if (to.row < from.row && to.col > from.col) {
		numRotates = 2;
	} else if (to.row > from.row && to.col > from.col) {
		numRotates = 3;
	}
	// Rotate until we are looking at the correct square
	for (let i = 0; i < numRotates; i++) {
		rotate(PI / 2);
	}
	let moveSize = from.size * offset * (abs(to.col - from.col) == 2 ? 2 : 1);
	// Drawing the arrow
	strokeWeight(2);
	line(0, 0, 0, moveSize);
	line(0, moveSize, -arrowSize, moveSize - arrowSize);
	line(0, moveSize, arrowSize, moveSize - arrowSize);
	pop();

}

// Shows all possible legal moves for the current player
function showCurrentMoves() {
	for (let i = 0; i < board.length; i++) {
		for (let j = 0; j < board[i].length; j++) {
			// If the square belongs to the current player
			if (board[i][j].owner === getCurrentPlayer()) {
				// ... and they must jump
				if (currentPlayer.mustJump(board)) {
					// Show the possible jumps if we should be highlighting
					if (board[i][j].mustJump) {
						board[i][j].showArrows = true;
					}
				} else {
					// Otherwise show the moves that aren't jumps
					board[i][j].showArrows = true;
				}
			}
		}

	}
}


// Hides all the moves on the board
function hideCurrentMoves() {
	showingCurrentMoves = false;
	for (let i = 0; i < board.length; i++) {
		for (let j = 0; j < board[i].length; j++) {
			board[i][j].showArrows = false;
		}
	}
}


// Draws the captured pieces
function drawCapturedPieces() {
	playerOne.drawCaptured();
	playerTwo.drawCaptured();
}







// EOF