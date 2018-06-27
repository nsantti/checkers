let startButton; // Button when we actually start the game
let buttonPalletLeft; // Color options for player one
let buttonPalletRight; // Color options for player two
let colorsSelected; // What colors did we select?
let preGameMainMenu; // Main Menu button for pregame screen.

function initPreGame() {
	startButton = new NButton("Start", width / 2 - 75, height - 100, 150, 75, false, 25);
	preGameMainMenu = new NButton("Main Menu", 50, height - 100, 150, 75, false, 25);
	buttonPalletLeft = [];
	buttonPalletRight = [];
	createButtonPallet(50, 250, buttonPalletLeft);
	createButtonPallet(width - 50 - 4 * 50 - 3 * 4, 250, buttonPalletRight);
	buttonPalletLeft[9].selected = true;
	buttonPalletRight[10].selected = true;
	colorsSelected = {
		p1col: buttonPalletLeft[9].col,
		p2col: buttonPalletRight[10].col,
	};
}

function drawPreGame() {
	drawWords();
	drawPreGameButtons();
	drawPlayerOneSide();
	drawPlayerTwoSide();
}

function drawPreGameButtons() {
	startButton.show();
	startButton.isInside(mouseX, mouseY);
	preGameMainMenu.show();
	preGameMainMenu.isInside(mouseX, mouseY);
}

function checkButtonsPreGame(x, y) {
	if (startButton.isInside(x, y)) {
		if (GAMESTATE === PREGAMEAI) {
			aiPlaying = true;
			reset(mainBoard, color(colorsSelected.p1col), color(colorsSelected.p2col), PLAYINGGAME, true);
		} else {
			aiPlaying = false;
			reset(mainBoard, color(colorsSelected.p1col), color(colorsSelected.p2col), PLAYINGGAME, false);
		}

	} else if (preGameMainMenu.isInside(x, y)) {
		reset(mainBoard, playerOne.color, playerTwo.color, MAINMENU, aiPlaying);

	} else {
		checkButtonPallet(x, y);
	}

}

function checkButtonPallet(x, y) {
	// If we clicked in Player One's Column
	if (x < width / 2) {
		for (let col of buttonPalletLeft) {
			if (col.isInside(x, y)) {
				// If the color is not being used by the other player
				if (!colorUsedBy(col, buttonPalletRight)) {
					// Update player color. Make everything false except legal selection
					colorsSelected.p1col = color(col.col);
					buttonPalletLeft.map(c => c.selected = false);
					col.selected = true;
				}
			}
		}
	} else {
		for (let col of buttonPalletRight) {
			if (col.isInside(x, y)) {
				if (!colorUsedBy(col, buttonPalletLeft)) {
					// Update player color. Make everything false except legal selection
					colorsSelected.p2col = color(col.col);
					buttonPalletRight.map(c => c.selected = false);
					col.selected = true;
				}
			}
		}
	}

}

function colorUsedBy(color, other) {
	for (let i = 0; i < other.length; i++) {
		if (other[i].selected) {
			if (other[i].col.levels.toString() === color.col.levels.toString()) {
				return true;
			}
		}
	}
	return false;
}

function drawPlayerOneSide() {
	push();
	noStroke();
	fill(255);
	textAlign(LEFT);
	textSize(30);
	text("Player One", 80, 150);
	stroke(255);
	line(20, 160, 280, 160);
	textSize(25);
	noStroke();
	//text("Customize name: ", 50, 230);
	// TODO: Get text from field
	text("Choose color", 50, 300);
	drawColorPallet(buttonPalletLeft);
	pop();
}

function drawPlayerTwoSide() {
	push();
	noStroke();
	fill(255);
	textAlign(LEFT);
	textSize(30);
	if (GAMESTATE === PREGAMEAI) {
		text("Computer", width - 80 - textWidth("Computer"), 150);
	} else {
		text("Player Two", width - 80 - textWidth("Player Two"), 150);
	}
	stroke(255);
	line(width - 20, 160, width - 280, 160);
	textSize(25);
	noStroke();
	//text("Customize name: ", width - 60 - textWidth("Customize name:"), 230);
	// TODO: Get text from field
	text("Choose color", width - 108 - textWidth("Choose color"), 300);
	drawColorPallet(buttonPalletRight);
	pop();
}

function drawColorPallet(pallet) {
	for (let colorButton of pallet) {
		colorButton.show();
		colorButton.isInside(mouseX, mouseY);
	}
}

function createButtonPallet(x, y, pallet) {
	let hSpace = 70;
	let vSpace = 20;
	let buttonSize = 50;
	let offset = 0;
	for (let i = 0; i < 12; i++) {
		if (i % 4 === 0) {
			offset = 0;
			vSpace += 100;
		}
		pallet.push(new ButtonPallet(offset * hSpace + x, y + vSpace, buttonSize, (color(42, 111, 221))));
		offset++;
	}
	pallet[0].col = color(244, 66, 66);
	pallet[1].col = color(234, 80, 37);
	pallet[2].col = color(124, 130, 14);
	pallet[3].col = color(145, 201, 14);
	pallet[4].col = color(55, 168, 6);
	pallet[5].col = color(3, 140, 153);
	pallet[6].col = color(19, 16, 206);
	pallet[7].col = color(102, 3, 183);
	pallet[8].col = color(183, 3, 165);
	pallet[9].col = color(145, 145, 145);
	pallet[10].col = color(244, 185, 66);
}


// EOF