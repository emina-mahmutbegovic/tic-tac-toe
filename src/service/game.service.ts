import { Service } from "typedi";
import { Game } from "../schema/game.schema";
import { CreateGameInput } from "../resolvers/types/create-game.input";
import { GameStatus } from "../enums/game-status.enum";
import { TicToe } from "../enums/tic-toe.enum";
import {v4 as uuidv4} from 'uuid';
import { gameStorage } from "../storage/game.storage";
import { JoinGameInput } from "../resolvers/types/join-game.input";
import { MakeMoveInput } from "../resolvers/types/make-move.input";
import { Winner } from "../enums/winner.enum";

@Service()
export class GameService {

  async createGame(input: CreateGameInput) {
    const game = new Game();

    game._id = uuidv4().toString();
    game.isSingleplayer = input.isSingleplayer;
    game.gameStatus = this.getGameStatus(input.isSingleplayer);
    game.winner = TicToe.UNDEFINED;
    game.playerName1 = input.playerName1;
    game.board = this.initializeBoard();

    gameStorage.set(game._id, game);

    return game;
  }

  async joinGame(input: JoinGameInput) {
    const game = gameStorage.get(input.gameId);

    if(!game){
      throw new Error ("Game with provided ID does not exist.")
    }

    if(game.gameStatus === GameStatus.IN_PROGRESS){
      throw new Error ("Can not join game in progress!")
    }
    
    if(this.validateInputData(game.playerName1, input.playerName2)){
      throw new Error ("Player names must not be the same!")
    }

    game.gameStatus = GameStatus.IN_PROGRESS;
    game.winner = TicToe.UNDEFINED;
    game.playerName2 = input.playerName2;
    gameStorage.set(game._id, game);

    return game;
  }

  async makeMove(input: MakeMoveInput) {
    const game = gameStorage.get(input.gameId);

    if (!game){
      throw new Error ("Game with provided ID does not exist.")
    }

    if (game.gameStatus === GameStatus.FINISHED) {
      throw new Error ("Game is already finished!")
    }

    if (game.isSingleplayer) {
      this.playSingleplayer(input, game);
      return game;
    }

    if (this.getPlayerOnTheMove(game.board) !== input.ticToe) {
      throw new Error ("Player is not on the move.")
    }

    if (game.board[input.coordinateX][input.coordinateY] !== 0) {
      throw new Error ("Can not repeat move.")
    } 
    
    game.board[input.coordinateX][input.coordinateY] = input.ticToe;

    const winner = this.checkWinner(game.board);
    game.winner = winner;

    if(winner !== TicToe.UNDEFINED) game.gameStatus = GameStatus.FINISHED;

    return game;
  }

  private getGameStatus (isSingleplayer: boolean) {
    if(isSingleplayer) {
      return GameStatus.IN_PROGRESS;
    } else {
      return GameStatus.CREATED;
    }
  }

  private validateInputData (playerName1: string, playerName2: string): boolean {
    return playerName1 === playerName2;
  }

  private initializeBoard (): number[][] {
    const board: number[][]  = 
    new Array(3)
      .fill(0)
      .map(() => 
        new Array(3).fill(0)
      );
    return board;
  }

  private getPlayerOnTheMove (board: number[][]): TicToe {
    let sumTic = 0;
    let sumToe = 0;

    for(let i = 0; i < 3; ++i) {
      for (let j = 0; j < 3; ++j) {
        if(board[i][j] === TicToe.X) sumTic += 1;
        else sumToe += 1;
      }
    }

    if((sumTic === 0 && sumToe === 0) || sumTic === sumToe) {
      return TicToe.X;
    }

    if(sumTic === sumToe) {
      return TicToe.X;
    }

    return TicToe.O;
  }

  private playSingleplayer (newMove: MakeMoveInput, game: Game) {
    game.board[newMove.coordinateX][newMove.coordinateY] = newMove.ticToe;
  }

  private isMovesLeft (board: number[][]) {
    for(let i = 0; i < 3; i++){
      for(let j = 0; j < 3; j++) {
        if (board[i][j] === 0)
        return true;
      }
    }         
    return false;
  }

  private checkWinner (board: number[][]) {
    // Checking for Rows for X or O victory.
    for(let row = 0; row < 3; ++row) {
      if (board[row][0] === board[row][1] && board[row][1] === board[row][2]) {
        if (board[row][0] === TicToe.X) {
          return TicToe.X;
        }    
        if (board[row][0] === TicToe.O) {
          return TicToe.O;
        } 
      }
    }
 
    // Checking for Columns for X or O victory.
    for(let col = 0; col < 3; ++col){
      if (board[0][col] === board[1][col] && board[1][col] === board[2][col]) {
        if (board[0][col] === TicToe.X) {
          return TicToe.X;
        }
        if (board[0][col] === TicToe.O) {
          return TicToe.O;
        }    
      }
    }
 
    // Checking for Diagonals for X or O victory.
    if (board[0][0] === board[1][1] && board[1][1] === board[2][2]) {
      if (board[0][0] === TicToe.X) {
        return TicToe.X;
      }
      if (board[0][0] === TicToe.O) {
        return TicToe.O;
      }
    }
 
    if (board[0][2] === board[1][1] && board[1][1] === board[2][0]) {
      if (board[0][2] === TicToe.X) {
        return TicToe.X;
      }
      if (board[0][2] === TicToe.O) {
        return TicToe.O;
      }
    }
    // Else if none of them have
    // won then return 0
    return TicToe.UNDEFINED;
  }

  // This is the minimax function. It 
  // considers all the possible ways 
  // the game can go and returns the 
  // value of the board
  private minimax (board: number[][], depth: number, isMax: boolean) {
    let score = this.checkWinner(board);
  
    // If Maximizer has won the game
    // return his/her evaluated score
    if (score === 10) return score;
  
    // If Minimizer has won the game
    // return his/her evaluated score
    if (score === -10) return score;
  
    // If there are no more moves and
    // no winner then it is a tie
    if (this.isMovesLeft(board) === false) return 0;
  
    // If this maximizer's move
    if (isMax) {
      let best = -1000;
      
      // Traverse all cells
      for(let i = 0; i < 3; ++i) {
        for(let j = 0; j < 3; ++j) {
        // Check if cell is empty
          if (board[i][j] === 0) {
          // Make the move
          board[i][j] = TicToe.X;
          
          // Call minimax recursively 
          // and choose the maximum value
          best = Math.max(best, this.minimax(board, depth + 1, !isMax));
          
          // Undo the move
          board[i][j] = 0;
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
        if (board[i][j] === 0) {
                      
        // Make the move
        board[i][j] = TicToe.O;
  
        // Call minimax recursively and 
        // choose the minimum value
        best = Math.min(best, this.minimax(board, depth + 1, !isMax));
  
        // Undo the move
        board[i][j] = 0;
          }
        }
      }
      return best;
    }
  }

  // This will return the best possible
  // move for the player
  private findBestMove (board: number[][]) {
    let bestVal = -1000;
    let bestMove = { row: -1, col: -1};
  
    // Traverse all cells, evaluate 
    // minimax function for all empty 
    // cells. And return the cell
    // with optimal value.
    for(let i = 0; i < 3; ++i) {
      for(let j = 0; j < 3; j++) {
              
        // Check if cell is empty
        if (board[i][j] === 0) {
                  
          // Make the move
          board[i][j] = TicToe.X;
  
          // compute evaluation function 
          // for this move.
          let moveVal = this.minimax(board, 0, false);
  
          // Undo the move
          board[i][j] = 0;
  
          // If the value of the current move 
          // is more than the best value, then 
          // update best
          if (moveVal > bestVal) {
            bestMove.row = i;
            bestMove.col = j;
            bestVal = moveVal;
          }
        }
      }
    }
    return bestMove;
  }
}
