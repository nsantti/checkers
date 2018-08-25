let playAloneButton; // Button to start the game
let playComputerButton; // Button to start game against computer
let howToButton; // Button for the game rules

function initStartScreen() {
	playAloneButton = new NButton.buttonBuilder()
		.withText("Play with a\r\nfriend")
		.withPos(width / 2 - 300, height / 2)
		.withWidth(200)
		.withHeight(100)
		.withTextSize(25)
		.build();
	playComputerButton = new NButton.buttonBuilder()
		.withText("Play against\r\nthe computer")
		.withPos(width / 2 + 100, height / 2)
		.withWidth(200)
		.withHeight(100)
		.withTextSize(25)
		.build();
	howToButton = new NButton.buttonBuilder()
		.withText("How to Play")
		.withPos(width / 2 - 100, height - 200)
		.withWidth(200)
		.withHeight(100)
		.withTextSize(25)
		.build();
}

function drawStartScreen() {
	drawWords();
	drawStartButtons();
	drawMadeBy();
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
		(i % 2 === 0) ? fill(215, 0, 0): fill(240);
		text(message[i] + "", width / 2 + gap * i + offset, 80);
	}
	pop();
}

function drawMadeBy() {
	push();
	fill(235);
	textSize(20);
	text("Created by Nate Santti\t\t Last updated 8/25/18", 20, height - 20);
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
