let rows; // Number of rows. Should always be 8
let cols; // Number of columns. Should always be 8
let board; // The gameboard
let w; // Size of the width of the game square
let h; // Size of the height of the game square
let currentSquare; // Tells us what square the user selected
let from; // What square we came from
let to; // What square we are going to
let p1movesButton;
let p2movesButton;
let startMove; // The starting square for a gamemove
let endMove; // The ending square for a gamemove
let moves = []; // Keeps track of each move
let playerOne; // Creating players
let playerTwo;
let currentPlayer; // A way to toggle back and forth between players
let mustJump; // If a player jumps and can jump again, they must do it
let canKeepJumping; // Tells us if the player can keep jumping with the piece they jumped with
let gameOver; // Tells us if the game is over
let arrows = []; // Keeps track of the arrows for each turn

// This function initializes all of the variables
function reset() {
	rows = 8;
	cols = 8;
	board = new Array(cols);
	w = 80;
	h = 80;
	currentSquare = undefined;
	from = undefined;
	to = undefined;
	p1movesButton = undefined;
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
	arrows = [];
	for (let i = 0; i < cols; i++) {
		board[i] = new Array(rows);
	}
	// Creating the button for playerOne
	p1movesButton = createButton('Toggle Player One Moves');
	p1movesButton.position(width + 15, 50);
	p1movesButton.mousePressed(showAllP1Moves);
	p1movesButton.mouseReleased(hideAllMoves);

	// Creating the button for playerTwo
	p1movesButton = createButton('Toggle Player Two Moves');
	p1movesButton.position(width + 15, 90);
	p1movesButton.mousePressed(showAllP2Moves);
	p1movesButton.mouseReleased(hideAllMoves);


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
	mainBoard();
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


function draw() {
	background(50);
	drawBoard();
	drawPlayerTurn();
	drawArrow();
	drawCapturedPieces();
}

function mousePressed() {
	// Check if we are inside the gameboard
	if (isInBounds(mouseX, mouseY)) {
		// If we are, highlight the legal moves of the square we are on
		currentSquare = getSquare(mouseX, mouseY);
		if (canKeepJumping) { // If we can keep jumping, then only the piece that went can go and it must jump
			if (currentSquare.hasPiece() && currentSquare.mustJump) {
				currentSquare.highLightJumps();
				console.log("must jump again");
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
	//console.log(mouseX + ", " + mouseY);
}

function mouseReleased() {


	// Once we let go of the mouse, unhighlight all the legal moves
	if (currentSquare) {
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
			if (startMove.mustJump && !startMove.jumps.includes(endMove)) {
				return;
			}
			if (currentPlayer.mustJump(board)) {
				if (!startMove.mustJump) return;
				if (startMove.mustJump && !startMove.jumps.includes(endMove)) return;
			}

			// Making the move
			let theMove = new GameMove(currentPlayer, startMove, endMove);
			console.log("Player " + startMove.ownerN + " Moved from (" + startMove.row + ", " +
				startMove.col + ") to (" + endMove.row + ", " + endMove.col + ")");

			theMove.doIt(); // Actually doing the move
			currentPlayer.moves.push(theMove);
			moves.push(theMove);
			arrows.push(theMove);

			// If we jumped a piece, remove the one that was jumped.
			// Then check to see if we can do more jumps
			if (jumpedAPiece(theMove)) {

				let square = squareThatWasJumped(theMove);
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
		}
		// After each move, check to see if the game is over
		checkGameOver();
	}
}

function checkGameOver() {
	// If a player has no more pieces or cannot play, they lose
	let playerOneLost = true;
	let playerTwoLost = true;
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
	aSquare.owner = null;
	aSquare.ownerN = 0;
	aSquare.piece = null;
	aSquare.king = false;
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









/// EOF