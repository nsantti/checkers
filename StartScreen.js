let playButton; // Button to start the game
let p1ColorButton; // Button to select player one color
let p2ColorButton; // Button to select player two color

function initStartScreen() {
	playButton = new NButton("Play", width / 2 - 100, height / 2, 200, 100, false, 25);
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
		(i % 2 == 0) ? fill(215, 0, 0): fill(0);
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
	playButton.show();
	playButton.isInside(mouseX, mouseY);
}

function checkButtonsStart(x, y) {
	if (playButton.isInside(x, y) && GAMESTATE === MAINMENU) {
		GAMESTATE = PREGAME;
	}
}






// EOF