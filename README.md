# Checkers
This is classic checkers with an interactive UI.

### Features: 
- Move generator for each player
  - Players must jump if they can
    - If player jumps, they must continue jumping with that piece
    - If player jumps and then becomes a king, they must continue jumping if possible
  - Button to highlight all legal moves for each player
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
