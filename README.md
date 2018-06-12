# Checkers
This is classic checkers with an interactive UI. ***NOTE*** Must use p5js library: <a href="https://p5js.org/download/">p5js</a>

### Features:
- Move generator for each player
  - Players must jump if they can
    - If player jumps, they must continue jumping with that piece
    - If player jumps and then becomes a king, they must continue jumping if possible
    - If player jumps, only the piece that jumps has moves generated
  - Button to highlight all legal moves for each player
  - Moves are generated after player turn ends
- Visual appeal
  - Squares are highlighted when the mouse is in them
  - Pieces that must jump are highlighted
  - Whenever a square is clicked, the legal moves will be highlighted until the mouse is released
  - Players are different colors
  - Arrows are drawn to show previous turn
    - If a multiple-jump move occurs, all arrows are drawn to show move path
  - Game will tell players whose turn it is
  - Game will tell players who wins
  - Kings are distinguishable from other pieces


### TODO:
- Animate the pieces once a move is declared
- Create a start screen
- Let the players enter their name to play
- Let the players select their color
- End the game after a tie (150 moves and still no winner)
- Create button to restart game
- Make background larger, but board size the same
- Create socket for players to play online
- Create AI for players to play against
- Show jumped pieces off to the side

### Updates made
- 6/12/18
  - Players now have a list of pieces they've captured
  - Captured pieces are drawn to the side of the board
  - Got rid of redundant code
  
- 6/11/18
  - Made background larger
  - Made board location dynamic
  - Put all drawing code in its own file
  - Show what color each player
  - Increased font size
  - Made reset function
  - Got rid of redundant code
  
