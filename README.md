# Checkers
This is classic checkers with an interactive UI. ***NOTE*** Uses the p5js library: <a href="https://p5js.org/download/" target="_blank">p5js</a>

### Features:
- Move generator for each player
  - Players must jump if they can
    - If player jumps, they must continue jumping with that piece
    - If player jumps and then becomes a king, they must continue jumping if possible
    - If player jumps, only the piece that jumps has moves generated
  - Button to highlight all legal moves for each player
  - Moves are generated after each player turn ends
- Clickable buttons
  - Player can click a button to make a random move
  - Button available to watch a computer play against itself
  - Game Over screen has a button to play again
    - Player colors and names are remembered for the next game
  - Button to see all available legal moves for current player
  - Undo button to undo the previous move
    - Can undo as many moves as wanted
  - Main menu button returns to the main menu
- Visual appeal
  - Squares are highlighted when the mouse is in them
  - Pieces that must jump are highlighted
  - Whenever a square is clicked, the legal moves will be shown until the mouse is released
  - Players are different colors
  - Arrows are drawn to show previous turn
    - If a multiple-jump move occurs, all arrows are drawn to show move path
    - Arrows are drawn to show legal moves when a piece is clicked
  - Game will tell players whose turn it is
  - Game will tell players who wins
  - Kings are distinguishable from other pieces
  - Jumped pieces are shown to the side
  - Game Over screen
    - Displays the winner
    - Shows game stats such as how many moves total and number of pieces lost
  - Main menu screen
    - Players select the color they want to play as
    - Players can enter their name
- AI
  - The AI generates a score for each possible move, then executes the best move possible
  - Always takes one second to make its move
  - Wins 99% of games against a random moves player (Ties 1% of the time, Loses < 1%)


### TODO:
- Animate the pieces once a move is declared
- Let the player select difficulty for AI (easy is random, hard is smart AI)

### Updates made
- 8/8/18
  - Removed unused functions
  - Exchanged most loops for 'for of' loops
  - Rewrote move generator function
    - Uses one function instead of two
    - function is 20 lines long instead of 70

&nbsp;
- 7/30/18
  - Fixed bug where user could move the AI before the AI takes its turn
  - Code refactoring
    - Removed unused code
    - Implemented 'builder pattern' for NButton and GameSquare class
  - Made the game pieces larger


&nbsp;
- 7/11/18
  - Made AI capable of playing as either player
  - Updated color options
    - Added a black background to button panel to see contrast
    - Selected colors now have an 'X' through them
  - Players can now enter their name to play
  - Added 'How to Play' menu with basic checkers rules


&nbsp;
- 6/27/18
  - Added an AI for the player to play against
    - The AI generates a score for each possible move, then executes the best move possible
    - AI always takes one second to make its move
    - Wins 95% of games against a random moves player (Ties 4% of the time, Loses 1%)
  - Main menu button added to pregame screen
  - Diabled 'Watch Computer Play' button when playing aginst an AI


&nbsp;
- 6/25/18
  - Fixed undo button glitch where all pieces that can jump are highlighted after undoing a multi-jump move
  - Added a start screen
  - Added a pre-game screen
    - Players select their color
    - Players cannot select the same color
  - Added a main menu button

&nbsp;
- 6/21/18
  - Added undo button to undo the previous move
    - Can keep undoing moves until back to game start state
    - Pieces are removed from the side if player is undoing a jump
  - Pressing 'u' will undo the previous move
  - Pressing 's' will show all legal moves for the current player

&nbsp;
- 6/19/18
  - Added button to show grid square numbers
  - Added button to reset the game
  - No longer highlighting the squares where each piece can go
    - Instead, an arrow is drawn to show where each piece can go
  - Added keypressed function
    - Pressing the 'm' button on the keyboard makes a random move

&nbsp;
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
