let startButton; // Button when we actually start the game
let buttonPalletLeft; // Color options for player one
let buttonPalletRight; // Color options for player two
let colorsSelected; // What colors did we select?
let preGameMainMenu; // Main Menu button for pregame screen.
let p1input; // Input field for player to enter their name
let p2input; // Input field for player to enter their name

function initPreGame() {
	startButton = new NButton.buttonBuilder()
		.withText("Start")
		.withPos(width / 2 - 75, height - 100)
		.withWidth(150)
		.withHeight(75)
		.withTextSize(25)
		.build();
	preGameMainMenu = new NButton.buttonBuilder()
		.withText("Main Menu")
		.withPos(50, height - 100)
		.withWidth(150)
		.withHeight(75)
		.withTextSize(25)
		.build();
	buttonPalletLeft = [];
	buttonPalletRight = [];
	createButtonPallet(50, 250, buttonPalletLeft);
	createButtonPallet(width - 50 - 4 * 50 - 3 * 4, 250, buttonPalletRight);
	p1input = createInput('Player One');
	p1input.position(55 + 25, 25 + 220);
	p1input.hide();
	p1input.size(150, 40);
	p1input.style('font-size', '20px');
	p2input = createInput('Player Two');
	p2input.position(width - 250 + 25, 25 + 220);
	p2input.hide();
	p2input.size(150, 40);
	p2input.style('font-size', '20px');
	buttonPalletLeft[9].selected = true;
	buttonPalletRight[10].selected = true;
	colorsSelected = {
		p1col: buttonPalletLeft[9].col,
		p2col: buttonPalletRight[10].col,
		p1name: "Player One",
		p2name: "Player Two"
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
	p1input.show();
	if (GAMESTATE === STATES.PREGAME) {
		p2input.show();
	}
}

function checkButtonsPreGame(x, y) {
	if (startButton.isInside(x, y)) {
		if (p1input.value().length > 0) {
			colorsSelected.p1name = p1input.value();
		}
		if (p2input.value().length > 0 && p2input.value() !== p1input.value()) {
			colorsSelected.p2name = p2input.value();
		}
		p1input.hide();
		p2input.hide();
		if (GAMESTATE === STATES.PREGAMEAI) {
			aiPlaying = true;
		} else {
			aiPlaying = false;
		}
		reset(mainBoard, color(colorsSelected.p1col), color(colorsSelected.p2col), colorsSelected.p1name, colorsSelected.p2name, STATES.PLAYINGGAME, aiPlaying);

	} else if (preGameMainMenu.isInside(x, y)) {
		p1input.hide();
		p2input.hide();
		reset(mainBoard, playerOne.color, playerTwo.color, playerOne.name, playerTwo.name, STATES.MAINMENU, aiPlaying);
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
	for (let otherColor of other) {
		if (otherColor.selected) {
			if (otherColor.col.levels.toString() === color.col.levels.toString()) {
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
	text(p1input.value(), 80, 150);
	stroke(255);
	line(20, 160, 280, 160);
	textSize(25);
	noStroke();
	text("Enter name: ", 50, 200);
	text("Choose color", 50, 300);
	fill(0);
	let left = buttonPalletLeft[0];
	let right = buttonPalletLeft[11];
	rect(left.x - left.size / 2 - 15, left.y - left.size / 2 - 15, right.x - left.x + right.size + 30, right.y - left.y + right.size + 30, 30);
	drawColorPallet(buttonPalletLeft);
	pop();
}

function drawPlayerTwoSide() {
	push();
	noStroke();
	fill(255);
	textAlign(LEFT);
	textSize(30);
	if (GAMESTATE === STATES.PREGAMEAI) {
		text("Computer", width - 80 - textWidth("Computer"), 150);
	} else {
		text(p2input.value(), width - 80 - textWidth("Player Two"), 150);
	}
	stroke(255);
	line(width - 20, 160, width - 280, 160);
	textSize(25);
	noStroke();
	if (GAMESTATE === STATES.PREGAME) {
		text("Enter name: ", width - 60 - textWidth("Customize name:"), 200);
	}
	text("Choose color", width - 108 - textWidth("Choose color"), 300);
	fill(0);
	let left = buttonPalletRight[0];
	let right = buttonPalletRight[11];
	rect(left.x - left.size / 2 - 15, left.y - left.size / 2 - 15, right.x - left.x + right.size + 30, right.y - left.y + right.size + 30, 30);
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
		pallet.push(new ButtonPallet(offset * hSpace + x, y + vSpace, buttonSize, (color(239, 239, 239))));
		offset++;
	}
	pallet[0].col = color(238, 25, 6);
	pallet[1].col = color(238, 122, 6);
	pallet[2].col = color(124, 130, 14);
	pallet[3].col = color(103, 70, 6);
	pallet[4].col = color(55, 168, 6);
	pallet[5].col = color(12, 201, 185);
	pallet[6].col = color(28, 28, 236);
	pallet[7].col = color(93, 40, 173);
	pallet[8].col = color(183, 3, 165);
	pallet[9].col = color(145, 145, 145);
	pallet[10].col = color(244, 185, 66);
}


// EOF
