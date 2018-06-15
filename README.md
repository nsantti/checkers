# Checkers
This is classic checkers with an interactive UI. ***NOTE*** Must use p5js library: <a href="https://p5js.org/download/" target="_blank">p5js</a>

### Features:
- Move generator for each player
  - Players must jump if they can
    - If player jumps, they must continue jumping with that piece
    - If player jumps and then becomes a king, they must continue jumping if possible
    - If player jumps, only the piece that jumps has moves generated
  - Button to highlight all legal moves for each player
  - Moves are generated after player turn ends
- Clickable buttons
  - Player can click a button to make a random move
  - Button available to watch a computer play against itself
  - Game Over screen has a button to play again
  - Button to see all available legal moves for current player
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
  - Jumped pieces are shown to the side
  - Game Over screen
    - Displays the winner
    - Shows game stats such as how many moves total and number of pieces lost


### TODO:
- Draw arrows for when showing possible legal moves
- Animate the pieces once a move is declared
- Create a start screen
- Let the players enter their name to play
- Let the players select their color
- Create socket for players to play online
- Create AI for players to play against

### Updates made
- 6/15/18
  - Got rid of DOM buttons
  - Can use the online P5 library now, no need to download it
  - Created button to highlight all legal moves for current player
  - Current player can no longer see moves for other player
  
  &nbsp;
- 6/14/18
  - Created custom button class
  - Added game over screen
    - User can see game stats and play again
  - Added random move button
  - Added button to watch computer play
  - Games end after 200 moves without a winner (TIE)
  
  &nbsp;
- 6/12/18
  - Players now have a list of pieces they've captured
  - Captured pieces are drawn to the side of the board
  - Got rid of redundant code

  &nbsp;  
- 6/11/18
  - Made background larger
  - Made board location dynamic
  - Put all drawing code in its own file
  - Show the color of each player
  - Increased font size
  - Made reset function
  - Got rid of redundant code
  
