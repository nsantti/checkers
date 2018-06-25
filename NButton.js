class NButton {
	constructor(text, x, y, w, h, hide, size) {
		this.text = text; // What does the button say?
		this.pos = createVector(x, y); // Where is the button?
		this.w = w; // How wide is the button?
		this.h = h; // How tall is the button?
		this.color = color(255);
		this.hide = hide; // Should we show the button?
		this.size = size || 14;
	}

	show() {
		if (this.hide) {
			return;
		}
		push();
		fill(this.color);
		rect(this.pos.x, this.pos.y, this.w, this.h);
		fill(0);
		textSize(this.size);
		textAlign(CENTER, CENTER);
		textStyle(BOLD);
		text(this.text, this.pos.x + this.w / 2, this.pos.y + this.h / 2);
		pop();
	}

	isInside(x, y) {
		if (x > this.pos.x && x < this.pos.x + this.w &&
			y > this.pos.y && y < this.pos.y + this.h) {
			this.color = color(200);
			return true;
		} else {
			this.color = color(255);
			return false;
		}
	}
}