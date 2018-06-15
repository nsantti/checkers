let rows; // Number of rows. Should always be 8
let cols; // Number of columns. Should always be 8
let board; // The gameboard
let w; // Size of the width of the game square
let h; // Size of the height of the game square
let currentSquare; // Tells us what square the user selected
let from; // What square we came from
let to; // What square we are going to
let showMovesButton; // Button to highlight all the legal moves for the current player
let startMove; // The starting square for a gamemove
let endMove; // The ending square for a gamemove
let moves = []; // Keeps track of each move
let playerOne; // Creating players
let playerTwo;
let currentPlayer; // A way to toggle back and forth between players
let mustJump; // If a player jumps and can jump again, they must do it
let canKeepJumping; // Tells us if the player can keep jumping with the piece they jumped with
let gameOver; // Tells us if the game is over
let GAMESTATE; // Tells us where in the game we are
let liveButtons; // Data structure to keep track of buttons during the game
let randomMoveButton; // Button to make a random move
let watchComputerPlay; // Flags the code to make the computer play against itself
let computerPlayButton; // Button for the user to click on to watch the computer play
let showingCurrentMoves; // Flag to know if we are currently showing all the current player moves



// This function initializes all of the variables
function reset(callback) {
	rows = 8;
	cols = 8;
	board = new Array(cols);
	w = 80;
	h = 80;
	currentSquare = undefined;
	from = undefined;
	to = undefined;
	showMovesButton = undefined;
	p2movesButton = undefined;
	startMove = undefined;
	endMove = undefined;
	moves = [];
	playerOne;
	playerTwo;
	currentPlayer = null;
	mustJump = false;
	canKeepJumping = false;
	gameOver = false;
	GAMESTATE = 1;
	watchComputerPlay = false;
	liveButtons = [];
	liveButtons.push(randomMoveButton = new NButton("Make a random move", width / 2 - 320, 10, 160, 50, false));
	liveButtons.push(computerPlayButton = new NButton("Toggle computer play", width / 2 + 160, 10, 160, 50, false));

	for (let i = 0; i < cols; i++) {
		board[i] = new Array(rows);
	}
	// Creating the button to show all legal moves for current player
	liveButtons.push(showMovesButton = new NButton("Toggle Current Player moves", width / 2 - 100, 10, 200, 50, false));

	playerOne = new Player(color(145), "Player One");
	playerTwo = new Player(color(244, 185, 66), "Player Two");
	currentPlayer = playerOne;

	// Creating the squares
	for (let i = 0; i < cols; i++) {
		for (let j = 0; j < rows; j++) {
			board[i][j] = ((i + j) % 2 == 0) ?
				new GameSquare(null, 0, i, j, j * w + (width - (8 * w)) / 2, i * h + 75, 215, 0, 0) :
				new GameSquare(null, 0, i, j, j * w + (width - (8 * w)) / 2, i * h + 75, 0, 0, 0);
		}
	}
	initVariables();
	if (callback instanceof Function) {
		callback();
	} else {
		mainBoard();
	}
	// The following game boards were used for testing purposes

	//  board1(); // Works
	//  board2(); // Works
	//  board3(); // Works
	//  board4(); // Works
	//  board5(); // Works
	//  board6(); // Works
	//  board7(); // Works
	generateMoves();
}

function setup() {
	createCanvas(800, 800);
	reset();
	textAlign(CENTER);
}

function mousePressed() {
	hideCurrentMoves();

	// End Game Menu
	if (gameOver) {
		if (playAgain.isInside(mouseX, mouseY)) {
			reset();
		}
		return;
	}
	// Checking if we clicked any of the buttons
	if (!gameOver) {
		if (randomMoveButton.isInside(mouseX, mouseY)) {
			makeRandomMove();
			return;
		}
		if (computerPlayButton.isInside(mouseX, mouseY)) {
			watchComputerPlay = !watchComputerPlay;
			return;
		}
		if (showMovesButton.isInside(mouseX, mouseY)) {
			showingCurrentMoves = !showingCurrentMoves;
			showCurrentMoves();
			return;
		}
	}

	// Check if we are inside the gameboard
	if (isInBounds(mouseX, mouseY)) {
		// If we are, highlight the legal moves of the square we are on
		currentSquare = getSquare(mouseX, mouseY);
		if (currentSquare.owner !== currentPlayer) {
			return;
		}
		if (canKeepJumping) { // If we can keep jumping, then only the piece that went can go and it must jump
			if (currentSquare.hasPiece() && currentSquare.mustJump) {
				currentSquare.highLightJumps();
				startMove = currentSquare;
			}
		} else {
			if (currentSquare.hasPiece()) {
				startMove = currentSquare;
				if (currentSquare.mustJump) {
					currentSquare.highLightJumps();
				} else {
					currentSquare.highlightNeighbors();
				}
			}
		}
	}
}

function mouseReleased() {
	// Once we let go of the mouse, unhighlight all the legal moves
	if (currentSquare && !showingCurrentMoves) {
		currentSquare.unHighlightNeighbors();
	}
	// Check for endMove
	if (isInBounds(mouseX, mouseY)) {
		endMove = getSquare(mouseX, mouseY);
		if (startMove != undefined &&
			startMove != endMove &&
			startMove.owner == currentPlayer &&
			startMove.neighbors.includes(endMove)) {
			// Forces the player to keep jumping if they still can
			if (currentPlayer.mustJump(board)) {
				if (!startMove.mustJump) return;
				if (startMove.mustJump && !startMove.jumps.includes(endMove)) return;
			}
			// Make the move once we figure out where we are going
			makeMove(startMove, endMove);
		}
	}
}

function makeMove(start, stop) {
	hideCurrentMoves();
	// Making the move
	let theMove = new GameMove(currentPlayer, startMove, endMove);
	// console.log("Player " + startMove.ownerN + " Moved from (" + startMove.row + ", " +
	// 	startMove.col + ") to (" + endMove.row + ", " + endMove.col + ")");

	theMove.doIt(); // Actually doing the move
	currentPlayer.moves.push(theMove);
	moves.push(theMove);

	// If we jumped a piece, remove the one that was jumped.
	// Then check to see if we can do more jumps
	if (jumpedAPiece(theMove)) {

		let square = squareThatWasJumped(theMove);
		// Each player keeps track of pieces it jumped
		currentPlayer.addCaptured(square.king);
		updatePieces();
		removePiece(square);
		endMove.generateNeighbors(board, false);

		checkForMoreJumps(endMove);
	}
	// If we can keep jumping, don't change turns
	if (!canKeepJumping) {
		currentPlayer = (currentPlayer == playerOne) ? playerTwo : playerOne;
		generateMoves();
	}

	// After each move, check to see if the game is over
	checkGameOver();
}

function checkGameOver() {
	// If a player has no more pieces or cannot play, they lose
	let playerOneLost = true;
	let playerTwoLost = true;
	// If we find at least one move for each player, game is not over
	for (let i = 0; i < rows; i++) {
		for (let j = 0; j < cols; j++) {
			if (board[i][j].neighbors.length > 0 || board[i][j].jumps.length > 0) {
				if (board[i][j].owner == playerOne) {
					playerOneLost = false;
				} else {
					playerTwoLost = false;
				}
			}
		}
	}
	if (playerOneLost) {
		gameOver = true;
		playerOne.won = false;
		playerTwo.won = true;
	} else if (playerTwoLost) {
		gameOver = true;
		playerTwo.won = false;
		playerOne.won = true;
	}
	// Checking for a tie. Ties are when 200 moves occur and still no winner
	if (!playerOneLost && !playerTwoLost) {
		if (moves.length >= 200) {
			gameOver = true;
		}
	}
	if (gameOver) {
		liveButtons.map(theBut => theBut.hide = true);
	}
}

function checkForMoreJumps(aSquare) { // Checkers if a piece can make more jumps
	canKeepJumping = (aSquare.jumps.length > 0);
	if (canKeepJumping) {
		aSquare.mustJump = true;
	}
}

function updatePieces() {
	for (let i = 0; i < board.length; i++) {
		for (let j = 0; j < board[i].length; j++) {
			board[i][j].mustJump = false;
		}
	}
}

// Makes a random move for the current player
function makeRandomMove() {
	let possibleStarts = [];
	if (currentPlayer.mustJump(board)) {
		// Get all squares that must jump
		for (let i = 0; i < board.length; i++) {
			for (let j = 0; j < board[i].length; j++) {
				if (board[i][j].owner == currentPlayer && board[i][j].mustJump) {
					possibleStarts.push(board[i][j]);
				}
			}
		}
	} else {
		for (let i = 0; i < board.length; i++) {
			for (let j = 0; j < board[i].length; j++) {
				// Get all square that can move
				if (board[i][j].owner == currentPlayer && board[i][j].neighbors.length > 0) {
					possibleStarts.push(board[i][j]);
				}
			}
		}
	}
	// Choose a random square to move
	startMove = random(possibleStarts);
	endMove = (currentPlayer.mustJump(board)) ? random(startMove.jumps) : random(startMove.neighbors);
	makeMove(startMove, endMove);
}

// Checks to see if we became a king the previous turn. Not using
function madeKing(aMove) {
	return (aMove.from.king == false && aMove.to.king);
}



// Gets the square the player clicked on.
// Assumed they clicked in the board
function getSquare(x, y) {
	let i = floor((y - 75) / w);
	let j = floor((x - (width - (8 * w)) / 2) / h);
	return board[i][j];
}

// Tells is if the user clicked within the board
function isInBounds(x, y) {
	return (x > (width - (8 * w)) / 2 && x < 8 * w + (width - (8 * w)) / 2 && y > 75 && y < 8 * h + 75);
}

function generateMoves() {
	// Generating the neighbors for each piece
	for (let i = 0; i < cols; i++) {
		for (let j = 0; j < rows; j++) {
			board[i][j].generateNeighbors(board, mustJump);
		}
	}
}

// Tells us if we jumped a piece.
function jumpedAPiece(aMove) {
	return (abs(aMove.from.row - aMove.to.row) > 1);
}

// Tells us the grid position of the square that was jumped
function squareThatWasJumped(aMove) {
	let x = (aMove.from.row + aMove.to.row) / 2;
	let y = (aMove.from.col + aMove.to.col) / 2;
	return board[x][y];
}

// Removes a piece from the gameboard
function removePiece(aSquare) {
	for (let i = aSquare.owner.pieces.length - 1; i >= 0; i--) {
		if (aSquare.owner.pieces[i] === aSquare.piece) {
			aSquare.owner.pieces.splice(i, 1);
		}
	}
	aSquare.reset();
}

function checkForKings() {
	// Check to see if we have any kings
	for (let i = 0; i < board[0].length; i++) {
		for (let j = 0; j < board.length; j++) {
			if ((i + j) % 2 == 1) {
				let square = board[i][j];
				// If the opposing player makes it across, king them
				if (square.ownerN == 1 && i == 7 || square.ownerN == 2 && i == 0) {
					makeKing(square);
				}
			}
		}
	}
}

// Make the piece a king
function makeKing(aSquare) {
	aSquare.king = true;
	generateMoves();
}

function getCurrentPlayer() {
	return (currentPlayer == playerOne) ? playerOne : playerTwo;
}

function getOtherPlayer() {
	return (currentPlayer == playerOne) ? playerTwo : playerOne;
}








/// EOF