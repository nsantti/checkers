let playAloneButton; // Button to start the game
let playComputerButton; // Button to start game against computer
let howToButton; // Button for the game rules

function initStartScreen() {
	playAloneButton = new NButton("Play with a\r\nfriend", width / 2 - 300, height / 2, 200, 100, false, 25);
	playComputerButton = new NButton("Play against the\r\ncomputer", width / 2 + 100, height / 2, 200, 100, false, 25);
	howToButton = new NButton("How to Play", width / 2 - 100, height - 200, 200, 100, false, 25);
}

function drawStartScreen() {
	// Draw words
	drawWords();
	// Make button to play
	drawStartButtons();
	drawMadeBy();
	// Make player one enter name and choose color
	// Make player two enter name and choose color
}

function drawWords() {
	push();
	fill(0);
	textSize(60);
	textAlign(CENTER);
	let gap = 40;
	let offset = -140;
	let message = "CHECKERS";
	for (let i = 0; i < message.length; i++) {
		(i % 2 === 0) ? fill(215, 0, 0): fill(0);
		text(message[i] + "", width / 2 + gap * i + offset, 80);
	}
	pop();
}

function drawMadeBy() {
	push();
	fill(235);
	textSize(20);
	text("Created by Nate Santti", 20, height - 20);
	pop();
}

function drawStartButtons() {
	playAloneButton.show();
	playAloneButton.isInside(mouseX, mouseY);
	playComputerButton.show();
	playComputerButton.isInside(mouseX, mouseY);
	howToButton.show();
	howToButton.isInside(mouseX, mouseY);
}

function checkButtonsStart(x, y) {
	if (playAloneButton.isInside(x, y) && GAMESTATE === STATES.MAINMENU) {
		GAMESTATE = STATES.PREGAME;
	} else if (playComputerButton.isInside(x, y) && GAMESTATE === STATES.MAINMENU) {
		GAMESTATE = STATES.PREGAMEAI;
	} else if (howToButton.isInside(x, y) && GAMESTATE === STATES.MAINMENU) {
		GAMESTATE = STATES.HOWTO;
	}
}







// EOF