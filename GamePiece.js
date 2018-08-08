class GamePiece {
	constructor(owner, size = 40) {
		this.owner = owner;
		this.size = size;
	}
}

GamePiece.prototype.showLegalMoves = function(square, board) {
	fill(145);
}