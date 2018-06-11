class Player {
  constructor(color) {
    this.pieces = [];
    this.moves = [];
    this.color = color;
    this.won = undefined;
    this.justJumped = false;
  }

  mustJump(board) {
    for (let i = 0; i < board.length; i++) {
      for (let j = 0; j < board[i].length; j++) {
        if (board[i][j].owner == this && board[i][j].mustJump) {
          return true;
        }
      }
    }
    return false;
  }

}
