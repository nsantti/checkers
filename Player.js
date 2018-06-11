class Player {
  constructor(color, name) {
    this.pieces = [];
    this.moves = [];
    this.color = color;
    this.won = undefined;
    this.justJumped = false;
    this.name = name;
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