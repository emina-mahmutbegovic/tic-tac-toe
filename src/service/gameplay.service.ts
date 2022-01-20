import { Service } from "typedi";
import { Constants } from "../constants/constants";
import { Score } from "../enums/score.enum";
import { TicToe } from "../enums/tic-toe.enum";
import { Winner } from "../enums/winner.enum";
import { Move } from "../models/move";

@Service()
export class GameplayService {
  
  initializeBoard (): string[][] {
  const board: string[][]  = 
    new Array(3)
      .fill(Constants.EMPTY_FIELD)
      .map(() => 
        new Array(3).fill(Constants.EMPTY_FIELD)
      );
    return board;
  }

  getPlayerOnTheMove (board: string[][]): TicToe {
    let sumTic = 0;
    let sumToe = 0;

    for(let i = 0; i < 3; ++i) {
      for (let j = 0; j < 3; ++j) {
        if(board[i][j] !== Constants.EMPTY_FIELD) {
          if(board[i][j] === TicToe.X) sumTic += 1;
          else sumToe += 1;
        }
      }
    }

    if((sumTic === 0 && sumToe === 0) || sumTic === sumToe) {
      return TicToe.X;
    }
    return TicToe.O;
  }

  evaluateGame(board: string[][]): Winner {
    const score = this.checkWinner(board);
    let winner = this.getWinner(score);

    if(!this.isMovesLeft(board)) {
      winner = Winner.TIE;
    }

    return winner;
  }

  isMovesLeft (board: string[][]) {
    for(let i = 0; i < 3; i++){
      for(let j = 0; j < 3; j++) {
        if (board[i][j] === Constants.EMPTY_FIELD)
        return true;
      }
    }         
    return false;
  }

  getWinner(score: number): Winner {
    switch(score) {
      case Score.X: return Winner.X;
      case Score.O: return Winner.O;
      default: return Winner.NONE;
    }
  }

  checkWinner (board: string[][]): Score {
    // Checking for Rows for X or O victory.
     // Checking for Rows for X or O victory.
     for(let row = 0; row < 3; ++row) {
      if (board[row][0] === board[row][1] && board[row][1] === board[row][2]) {
        if (board[row][0] === TicToe.X) {
          return Score.X;
        }    
        if (board[row][0] === TicToe.O) {
          return Score.O;
        } 
      }
    }
 
    // Checking for Columns for X or O victory.
    for(let col = 0; col < 3; ++col){
      if (board[0][col] === board[1][col] && board[1][col] === board[2][col]) {
        if (board[0][col] === TicToe.X) {
          return Score.X;
        }
        if (board[0][col] === TicToe.O) {
          return Score.O;
        }    
      }
    }
 
    // Checking for Diagonals for X or O victory.
    if (board[0][0] === board[1][1] && board[1][1] === board[2][2]) {
      if (board[0][0] === TicToe.X) {
        return Score.X;
      }
      if (board[0][0] === TicToe.O) {
        return Score.O;
      }
    }
 
    if (board[0][2] === board[1][1] && board[1][1] === board[2][0]) {
      if (board[0][2] === TicToe.X) {
        return Score.X;
      }
      if (board[0][2] === TicToe.O) {
        return Score.O;
      }
    }
    // Else if none of them have
    // won then return 0
    return Score.NONE;
  }

  // This is the minimax function. It 
  // considers all the possible ways 
  // the game can go and returns the 
  // value of the board
  minimax (board: string[][], depth: number, isMax: boolean) {  
    let score = this.checkWinner(board);

    // If Maximizer has won the game return his/her
    // evaluated score
    if (score === Score.X) {
        return score;
    }
      
    // If Minimizer has won the game return his/her
    // evaluated score
    if (score === Score.O) {
        return score;
    }
       
    // If there are no more moves and no winner then
    // it is a tie
    if (!this.isMovesLeft(board)) {
        return Score.NONE;
    }
    
    // If this maximizer's move
    if (isMax) {
        let best = -1000;
      
      // Traverse all cells   
      for(let i = 0; i < 3; ++i) {
        for(let j = 0; j < 3; ++j) {
        // Check if cell is empty
          if (board[i][j] === Constants.EMPTY_FIELD) {
          // Make the move
          board[i][j] = TicToe.X;
          
          // Call minimax recursively 
          // and choose the maximum value
          best = Math.max(best, this.minimax(board, depth + 1, !isMax));
          
          // Undo the move
          board[i][j] = Constants.EMPTY_FIELD;
          }
        }
      }
      return best;
    }
    
    // If this minimizer's move
    else {
      let best = 1000;
      
      // Traverse all cells
      for(let i = 0; i < 3; ++i) {
        for(let j = 0; j < 3; ++j) {
        // Check if cell is empty
        if (board[i][j] === Constants.EMPTY_FIELD) {
                      
        // Make the move
        board[i][j] = TicToe.O;
  
        // Call minimax recursively and 
        // choose the minimum value
        best = Math.min(best, this.minimax(board, depth + 1, !isMax));
  
        // Undo the move
        board[i][j] = Constants.EMPTY_FIELD;
          }
        }
      }
      return best;
    }
  }

  // This will return the best possible
  // move for the player
  findBestMove (board: string[][]) {
    let bestVal = 1000;
    let bestMove = new Move(-1, -1);
  
    // Traverse all cells, evaluate 
    // minimax function for all empty 
    // cells. And return the cell
    // with optimal value.
    // Traverse all cells
    for(let i = 0; i < 3; ++i) {
      for(let j = 0; j < 3; j++) {
              
        // Check if cell is empty
        if (board[i][j] === Constants.EMPTY_FIELD) {
                  
          // Make the move
          board[i][j] = TicToe.O;
  
          // compute evaluation function 
          // for this move.
          let moveVal = this.minimax(board, 0, true);
  
          // Undo the move
          board[i][j] = Constants.EMPTY_FIELD;
  
          // If the value of the current move 
          // is more than the best value, then 
          // update best
          if (moveVal < bestVal) {
            bestMove.coordinateX = i;
            bestMove.coordinateY = j;
            bestVal = moveVal;
          }
        }
      }
    }
    return bestMove;
  }
}