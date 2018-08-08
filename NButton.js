class NButton {

	constructor(builder) {
		this.text = builder.text;
		this.pos = createVector(builder.x, builder.y);
		this.w = builder.width;
		this.h = builder.height;
		this.color = builder.color;
		this.hide = builder.hide;
		this.size = builder.size;
	}

	static get buttonBuilder() {
		class Builder {
			constructor() {
				this.color = color(255);
				this.hide = false;
				this.size = 14;
			}

			withText(text) {
				this.text = text;
				return this;
			}

			withPos(x, y) {
				this.x = x;
				this.y = y;
				return this;
			}

			withWidth(w) {
				this.width = w;
				return this;
			}

			withHeight(h) {
				this.height = h;
				return this;
			}

			withColor(r, g = 0, b = 0) {
				this.color = color(r, g, b);
				return this;
			}

			hidden(bool) {
				this.hide = bool;
				return this;
			}

			withTextSize(size) {
				this.size = size;
				return this;
			}

			build() {
				return new NButton(this);
			}
		}
		return Builder;
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