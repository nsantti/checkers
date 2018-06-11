class GameMove {
  constructor (owner, from, to) {
    this.owner = owner;
    this.from = from;
    this.to = to;
  }

  // Actually doing the move. Mostly transferring instance variables
  doIt() {
    this.to.piece = this.from.piece;
    this.to.owner = this.from.owner;
    this.to.ownerN = this.from.ownerN;
    this.to.mustJump = false;
    if (!this.from.king) {
      if ((this.to.row == 7 && this.from.ownerN == 1) ||
          (this.to.row == 0 && this.from.ownerN == 2)) {
        console.log("MAKE KING");
        this.to.king = true;
      }
    } else {
      this.to.king = this.from.king;
    }

    this.from.mustJump = false;
    this.from.piece = null;
    this.from.owner = null;
    this.from.ownerN = 0;
    this.from.king = false;
  }

}
