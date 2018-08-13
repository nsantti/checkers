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
let ai; // An AI for players to play against
let currentPlayer; // A way to toggle back and forth between players
let mustJump; // If a player jumps and can jump again, they must do it
let canKeepJumping; // Tells us if the player can keep jumping with the piece they jumped with
let gameOver; // Tells us if the game is over
let GAMESTATE; // Tells us where in the game we are
let STATES; // Possible gamestates
let liveButtons; // Data structure to keep track of buttons during the game
let randomMoveButton; // Button to make a random move
let watchComputerPlay; // Flags the code to make the computer play against itself
let computerPlayButton; // Button for the user to click on to watch the computer play
let showingCurrentMoves; // Flag to know if we are currently showing all the current player moves
let toggleNumberButton; // Button to toggle showing the text or not
let resetButton; // Button to reset the game
let undoButton; // Button to undo the move
let mainMenuButton; // Button to return to the main menu
let JUMPEDPIECES; // Holds all jumped pieces
let playerMoves; // What player goes for what turn
let aiPlaying; // Is an ai playing?
let simulate; // Are we simulating the games?
let results; // Results from simulating
let gameCount; // How many games have we simulated?
let population; // Population of AI's for genetic evolution
let populationSize;
let populationIndex;



// This function initializes all of the variables
function reset(callback, p1color = color(145), p2color = color(244, 185, 66), p1name = "Player One", p2name = "Player Two", state = 2, ai = false) {
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
	mustJump = false;
	canKeepJumping = false;
	gameOver = false;
	GAMESTATE = state;
	STATES = {
		MAINMENU: 0,
		PREGAME: 1,
		PLAYINGGAME: 2,
		PREGAMEAI: 3,
		HOWTO: 4
	};

	watchComputerPlay = false;
	aiPlaying = ai;
	JUMPEDPIECES = [];
	playerMoves = [];
	liveButtons = [];
	computerPlayButton = undefined;


	liveButtons.push(toggleNumberButton = new NButton.buttonBuilder()
		.withText("Numbers")
		.withPos(5, height)
		.withWidth(70)
		.withHeight(50)
		.build());
	liveButtons.push(resetButton = new NButton.buttonBuilder()
		.withText("Reset")
		.withPos(width - 75, 10)
		.withWidth(70)
		.withHeight(50)
		.build());
	liveButtons.push(undoButton = new NButton.buttonBuilder()
		.withText("Undo")
		.withPos(width - 75, 70)
		.withWidth(70)
		.withHeight(50)
		.build());
	liveButtons.push(randomMoveButton = new NButton.buttonBuilder()
		.withText("Make a random move")
		.withPos(width / 2 - 320, 10)
		.withWidth(160)
		.withHeight(50)
		.build());
	liveButtons.push(mainMenuButton = new NButton.buttonBuilder()
		.withText("Main\nMenu")
		.withPos(5, 10)
		.withWidth(70)
		.withHeight(50)
		.build());

	for (let i = 0; i < cols; i++) {
		board[i] = new Array(rows);
	}
	// Creating the button to show all legal moves for current player
	liveButtons.push(showMovesButton = new NButton.buttonBuilder()
		.withText("Show Current Player moves")
		.withPos(width / 2 - 100, 10)
		.withWidth(200)
		.withHeight(50)
		.build());

	playerOne = new Player(p1color, p1name);
	//playerTwo = new Player(p2color, p2name);
	if (aiPlaying) {
		//playerOne = new AI(p1color, "Computer", population[populationIndex].weights);
		playerTwo = new AI(p2color, "Computer", population[populationIndex].weights);
	} else {
		liveButtons.push(computerPlayButton = new NButton.buttonBuilder()
			.withText("Toggle computer play")
			.withPos(width / 2 + 160, 10)
			.withWidth(160)
			.withHeight(50)
			.build());

		playerTwo = new Player(p2color, p2name);
		//playerOne = new Player(p1color, p1name);

	}
	currentPlayer = playerOne;
	playerMoves.push(playerOne);

	// Creating the squares
	for (let i = 0; i < cols; i++) {
		for (let j = 0; j < rows; j++) {
			let theSquare = new GameSquare.buildSquare()
				.withRow(i)
				.withColumn(j)
				.withPos(j * w + (width - (8 * w)) / 2, i * h + 75);
			if ((i + j) % 2 === 0) {
				theSquare.withColor(215, 0, 0)
			} else {
				theSquare.withColor(0, 0, 0);
			}
			board[i][j] = theSquare.build();
		}
	}
	initVariables();
	initStartScreen();
	initPreGame();
	initHowTo();
	if (callback instanceof Function) {
		callback();
	} else {
		mainBoard();
	}
	generateMoves();
}


function createPopulation() { // Used this when evolving AI weights
	population = [];
	for (let i = 0; i < 10; i++) {
		population.push({
			weights: [5, -4, -2, 0.5, 1, 0.5, 4],
			results: {
				won: 0,
				lost: 0,
				tie: 0
			}
		});
	}
}

function setup() {
	let cnv = createCanvas(800, 800);
	cnv.position((windowWidth - width) / 2, (windowHeight - height) / 2);
	select('#webValidate').hide(); // This only disappears if the browser can load the sketch
	createPopulation();
	populationIndex = 0;
	frameRate(100);
	populationSize = 100;
	reset(mainBoard, color(0), color(0), "Player One", "Player Two", 0, false);
	//reset(mainBoard, color(145), color(244, 185, 66), "Player One", "Player Two",2, true);
	simulate = false;
	results = {
		won: 0,
		lost: 0,
		tie: 0
	};
	gameCount = 0;
}

function mousePressed() {
	// End Game Menu
	if (GAMESTATE === STATES.MAINMENU) {
		checkButtonsStart(mouseX, mouseY);
	} else if (GAMESTATE === STATES.PREGAME || GAMESTATE === STATES.PREGAMEAI) {
		checkButtonsPreGame(mouseX, mouseY);
	} else if (GAMESTATE === STATES.HOWTO) {
		checkButtonsHowTo(mouseX, mouseY);
	} else if (GAMESTATE === STATES.PLAYINGGAME) {
		hideCurrentMoves();
		checkButtons(mouseX, mouseY);
		if (aiPlaying && getCurrentPlayer() === playerTwo) return;
		// Check if we are inside the gameboard
		if (isInBounds(mouseX, mouseY)) {
			// If we are, highlight the legal moves of the square we are on
			currentSquare = getSquare(mouseX, mouseY);
			if (currentSquare.owner !== currentPlayer) {
				return;
			}
			if (currentSquare.hasPiece()) {
				startMove = currentSquare;
			}
			if (getCurrentPlayer().mustJump(board) && !currentSquare.mustJump) {
				currentSquare.showArrows = false;
			} else {
				currentSquare.showArrows = true;
			}
		}
	}
}

// Checks each of the live game buttons to see if the user clicked them
function checkButtons(x, y) {
	if (gameOver && GAMESTATE === STATES.PLAYINGGAME) {
		if (playAgain.isInside(x, y)) {
			reset(mainBoard, playerOne.color, playerTwo.color, playerOne.name, playerTwo.name, STATES.PLAYINGGAME, aiPlaying);
		}
		if (mainMenu.isInside(x, y)) {
			reset(mainBoard, playerOne.color, playerTwo.color, playerOne.name, playerTwo.name, STATES.MAINMENU, aiPlaying);
		}
		return;
	}
	// Checking if we clicked any of the buttons
	if (!gameOver && GAMESTATE === STATES.PLAYINGGAME) {
		if (randomMoveButton.isInside(x, y)) {
			if (aiPlaying && getCurrentPlayer() === playerOne) {
				makeRandomMove()
			} else if (!aiPlaying) {
				makeRandomMove();
			}
		}
		if (!aiPlaying && computerPlayButton.isInside(x, y)) {
			watchComputerPlay = !watchComputerPlay;
		}
		if (showMovesButton.isInside(x, y)) {
			if (!showingCurrentMoves) {
				showCurrentMoves();
				showingCurrentMoves = true;
			}
		}
		if (toggleNumberButton.isInside(x, y)) {
			toggleNumbers();
		}
		if (resetButton.isInside(x, y)) {
			reset(mainBoard, playerOne.color, playerTwo.color, playerOne.name, playerTwo.name, STATES.PLAYINGGAME, aiPlaying);
		}
		if (undoButton.isInside(x, y)) {
			undo();
		}
		if (mainMenuButton.isInside(x, y)) {
			reset(mainBoard, playerOne.color, playerTwo.color, playerOne.name, playerTwo.name, STATES.MAINMENU, aiPlaying);
		}
	}
}

function mouseReleased() {
	// Once we let go of the mouse, unhighlight all the legal moves
	if (currentSquare && !showingCurrentMoves) {
		currentSquare.showArrows = false;
	}
	// Check for endMove
	if (isInBounds(mouseX, mouseY)) {
		endMove = getSquare(mouseX, mouseY);
		if (startMove !== undefined &&
			startMove !== endMove &&
			startMove.owner === getCurrentPlayer() &&
			startMove.neighbors.includes(endMove)) {
			// Forces the player to keep jumping if they still can
			if (getCurrentPlayer().mustJump(board)) {
				if (!startMove.mustJump) return;
				if (!startMove.jumps.includes(endMove)) return;
			}
			// Make the move once we figure out where we are going
			makeMove(startMove, endMove);
		}
	}
}

function keyPressed() {
	if (key == 'M') {
		if (!gameOver && !aiPlaying) {
			makeRandomMove();
		} else if (aiPlaying && getCurrentPlayer() === playerOne) {
			makeRandomMove();
		}
	}
	if (key == 'U') {
		if (!gameOver) {
			undo();
		}
	}
	if (key == 'S') {
		if (!showingCurrentMoves) {
			showCurrentMoves();
			showingCurrentMoves = true;
		}
	}
}

function undo() {
	if (moves.length === 0) return;

	let current = moves[moves.length - 1].from;
	let theMove = moves[moves.length - 1];

	moves[moves.length - 1].undoIt();
	moves.pop();
	let prevPlayer = playerMoves.pop();
	if (prevPlayer !== getCurrentPlayer()) {
		switchPlayer();
	}
	getCurrentPlayer().moves.pop();
	updatePieces();
	current.generateNeighbors(board);
	if (!current.mustJump || moves.length === 0) {
		generateMoves();
	}
	// We can jump, it isn't this first move, and we didn't just jump. Handles board12 edge case where
	// if we have more than one piece that can jump, it will remember it when we undo the jump
	else if (current.mustJump && moves.length > 0 && moves[moves.length - 1].fromCopy.owner !== getCurrentPlayer()) {
		for (let eachMove of getCurrentPlayer().squaresOwned(board)) {
			eachMove.generateNeighbors(board);
		}
	}
	frameCounter = 0; // The computer's frameCount variable could act weird if we don't reset it here
}

function makeMove(start, stop) {
	hideCurrentMoves();
	startMove = start;
	endMove = stop;
	// Making the move
	let theMove = new GameMove(getCurrentPlayer(), startMove, endMove);

	theMove.doIt(); // Actually doing the move
	getCurrentPlayer().moves.push(theMove);
	moves.push(theMove);
	playerMoves.push(getCurrentPlayer());

	// If we jumped a piece, remove the one that was jumped.
	// Then check to see if we can do more jumps
	if (jumpedAPiece(theMove)) {
		let square = squareThatWasJumped(theMove);
		// Each player keeps track of pieces it jumped
		getCurrentPlayer().addCaptured(square.king);
		JUMPEDPIECES.push(square);
		updatePieces();
		removePiece(square);
		endMove.generateNeighbors(board);
		checkForMoreJumps(endMove);
	}
	// If we can keep jumping, don't change turns
	if (!canKeepJumping) {
		switchPlayer();
		generateMoves();
	}

	// After each move, check to see if the game is over
	checkGameOver();
}

function checkGameOver() {
	// If a player has no more pieces or cannot play, they lose
	if (!getCurrentPlayer().canMove(board)) {
		gameOver = true;
		getCurrentPlayer().won = false;
		getOtherPlayer().won = true;
	}

	// Checking for a tie. Ties are when 200 moves occur and still no winner
	else {
		if (moves.length >= 200) {
			gameOver = true;
		}
	}
	if (gameOver) {
		liveButtons.map(eachButton => eachButton.hide = true);
	}
}

function checkForMoreJumps(aSquare) { // Checkers if a piece can make more jumps
	canKeepJumping = (aSquare.jumps.length > 0);
	if (canKeepJumping) {
		aSquare.mustJump = true;
	}
}

function updatePieces() {
	for (let row of board) {
		for (let square of row) {
			square.mustJump = false;
			square.neighbors = [];
			square.jumps = [];
			square.showArrows = false;
		}
	}
}

function toggleNumbers() {
	for (let row of board) {
		for (let square of row) {
			square.displayText = !square.displayText;
		}
	}
}

// Makes a random move for the current player
function makeRandomMove() {
	let possibleStarts = [];
	for (let row of board) {
		for (let square of row) {
			if (square.owner === getCurrentPlayer()) {
				if (getCurrentPlayer().mustJump(board) && square.mustJump) {
					possibleStarts.push(square);
				} else if (!getCurrentPlayer().mustJump(board) && square.neighbors.length > 0) {
					possibleStarts.push(square);
				}
			}
		}
	}

	// Choose a random square to move
	startMove = random(possibleStarts);
	endMove = (getCurrentPlayer().mustJump(board)) ? random(startMove.jumps) : random(startMove.neighbors);
	makeMove(startMove, endMove);

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
	for (let row of board) {
		for (let square of row) {
			square.generateNeighbors(board);
		}
	}
}

function switchPlayer() {
	currentPlayer = (currentPlayer == playerOne) ? playerTwo : playerOne;
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

function getCurrentPlayer() {
	return (currentPlayer == playerOne) ? playerOne : playerTwo;
}

function getOtherPlayer() {
	return (currentPlayer == playerOne) ? playerTwo : playerOne;
}








/// EOF