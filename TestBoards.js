function mainBoard() {
	for (let i = 0; i < 3; i++) {
		for (let j = (i % 2 == 0) ? 1 : 0; j < 8; j += 2) {
			playerPiece(i, j, 1);
		}
	}

	// Adding the starting pieces to the gameboard
	for (let i = 5; i < 8; i++) {
		for (let j = (i % 2 == 0) ? 1 : 0; j < 8; j += 2) {
			playerPiece(i, j, 2);
		}
	}
}

function board1() {
	playerPiece(7, 2, 2);
	playerPiece(7, 0, 2);
	playerPiece(6, 1, 1);
	playerPiece(4, 3, 1);
	playerPiece(2, 5, 1);
	playerPiece(4, 1, 1);
	playerPiece(2, 1, 1);
}

function board2() {
	playerPiece(0, 5, 1);
	playerPiece(0, 1, 1);
	playerPiece(0, 7, 1);
	playerPiece(1, 6, 2);
	playerPiece(3, 4, 2);
	playerPiece(5, 2, 2);
	playerPiece(3, 6, 2);
	playerPiece(5, 6, 2);
	playerPiece(1, 2, 2);
	playerPiece(5, 4, 2);
	playerPiece(6, 1, 2);
}

function board3() {
	playerPiece(3, 0, 1, true);
	playerPiece(2, 1, 2);
	playerPiece(2, 3, 2);
	playerPiece(2, 5, 2);
	playerPiece(6, 7, 2, true);
	playerPiece(5, 6, 1);
	playerPiece(5, 4, 1);
	playerPiece(5, 2, 1);
}

function board4() {
	playerPiece(2, 3, 1);
	playerPiece(3, 2, 2);
	playerPiece(3, 4, 2);
	playerPiece(5, 2, 2);
	playerPiece(5, 4, 2);
}

function board5() {
	playerPiece(2, 3, 1, true);
	playerPiece(3, 2, 2);
	playerPiece(3, 4, 2);
	playerPiece(5, 2, 2);
	playerPiece(5, 4, 2);
}

function board6() {
	playerPiece(1, 6, 1, true);
	playerPiece(1, 4, 1, true);
	playerPiece(2, 5, 2);
	playerPiece(4, 5, 2);
	playerPiece(6, 5, 2);
	playerPiece(6, 3, 2, true);
	playerPiece(6, 1, 2, true);
	playerPiece(5, 2, 1);
	playerPiece(3, 2, 1);
	playerPiece(1, 2, 1);
}

function board7() {
	playerPiece(6, 1, 1);
	playerPiece(6, 3, 2);
}

function board8() {
	playerPiece(2, 1, 1);
	playerPiece(3, 2, 2);
}

function board9() {
	playerPiece(5, 2, 1);
	playerPiece(7, 0, 2);
	playerPiece(7, 2, 2);
}

function board10() {
	playerPiece(5, 0, 1);
	playerPiece(6, 1, 2);
	playerPiece(6, 3, 2);
	playerPiece(6, 5, 2);
}

function board11() {
	playerPiece(1, 6, 1);
	playerPiece(2, 5, 2);
	playerPiece(4, 5, 2);
	playerPiece(6, 5, 2);
	playerPiece(6, 3, 2);
	playerPiece(4, 1, 2);
	playerPiece(2, 1, 2);
	playerPiece(2, 3, 2);
	playerPiece(4, 3, 2);
	playerPiece(6, 1, 2);

}

// Simple way to place pieces on the board
function playerPiece(aRow, aCol, anOwnerN, aKing = false) {
	let anOwner = (anOwnerN == 1) ? playerOne : playerTwo;
	board[aRow][aCol].addPiece(new GamePiece(anOwner));
	board[aRow][aCol].owner = anOwner;
	board[aRow][aCol].ownerN = anOwnerN;
	board[aRow][aCol].king = aKing;
	anOwner.pieces.push(board[aRow][aCol].piece);
}