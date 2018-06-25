class ButtonPallet {
	constructor(x, y, size, col) {
		this.x = x;
		this.y = y;
		this.size = size;
		this.col = col;
		this.inside = false;
		this.selected = false;
	}

	show() {
		push();
		fill(this.col);
		if (this.inside || this.selected) {
			stroke(0);
			strokeWeight(3);
		} else {
			noStroke();
		}
		ellipse(this.x, this.y, this.size);
		pop();
	}

	isInside(x, y) {
		let distance = dist(x, y, this.x, this.y);
		if (distance < this.size * 0.5) {
			this.inside = true;
			return true;
		}
		this.inside = false;
		return false;
	}

}