let howToMainMenu; // Button to return to the main menu

function initHowTo() {
	howToMainMenu = new NButton.buttonBuilder()
		.withText("Main Menu")
		.withPos(width - 200, 25)
		.withWidth(150)
		.withHeight(75)
		.withTextSize(25)
		.build();
}

function drawHowTo() {
	drawWords();
	drawHowToButtons();
	drawRules();
}

function drawHowToButtons() {
	howToMainMenu.show();
	howToMainMenu.isInside(mouseX, mouseY);
}

function drawRules() {
	push();
	textSize(20);
	fill(240);
	noStroke();
	let spacing = 35;
	let offset = 0;
	text("- MOVES", 25, 125 + spacing * offset++);
	text("-   Players take turns making moves against each other", 25, 125 + spacing * offset++);
	text("-   Player One may only move downwards, Player Two upwards", 25, 125 + spacing * offset++);
	text("-   Players may only move one square diagonally to an empty square", 25, 125 + spacing * offset++);
	text("- JUMPS", 25, 125 + spacing * offset++);
	text("-   Jumping one piece is allowed as long as the jump is diagonal", 25, 125 + spacing * offset++);
	text("-   A player must jump if they can", 25, 125 + spacing * offset++);
	text("-   If more than one piece can jump, it is up to the player which one jumps", 25, 125 + spacing * offset++);
	text("-   Pieces that can jump are highlighted white", 25, 125 + spacing * offset++);
	text("-   If a piece jumps, it must continue jumping until it can no longer jump", 25, 125 + spacing * offset++);
	text("- KINGS", 25, 125 + spacing * offset++);
	text("-   If a piece makes it across the board, it becomes a king", 25, 125 + spacing * offset++);
	text("-   Kings have a black dot on them", 25, 125 + spacing * offset++);
	text("-   Kings can move and jump forwards or backwards", 25, 125 + spacing * offset++);
	text("- WINNING", 25, 125 + spacing * offset++);
	text("-   A player wins the game when they capture all of their opponent's pieces", 25, 125 + spacing * offset++);
	text("-   A player wins if the other player cannot move", 25, 125 + spacing * offset++);
	text("-   Once 200 moves are reached, the game is considered a TIE, and ends", 25, 125 + spacing * offset++);

	pop();
}

function checkButtonsHowTo(x, y) {
	if (howToMainMenu.isInside(x, y)) {
		GAMESTATE = STATES.MAINMENU;
	}
}