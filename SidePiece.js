// The pieces we see on the side when they are captured
class SidePiece {
	constructor(color, index, king, owner) {
		this.color = color;
		this.pos = ((owner == playerOne) ? createVector(40, index * 50 + 120) : createVector(width - 40, height - index * 50 - 120));
		this.index = index;
		this.king = king;
		this.size = 30;
		this.owner = owner;
	}

	// The player object keeps track of all the captured pieces. This will show the captured piece
	show() {
		fill(this.color);
		ellipse(this.pos.x, this.pos.y, this.size);
		if (this.king) { // Draws a dot in the center of the circle if we are a king
			fill(0);
			ellipse(this.pos.x, this.pos.y, 5, 5);
		}
	}
}