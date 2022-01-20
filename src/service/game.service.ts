import { Service } from 'typedi';
import { Game } from '../schema/game.schema';
import { CreateGameInput } from '../resolvers/types/create-game.input';
import { GameStatus } from '../enums/game-status.enum';
import { TicToe } from '../enums/tic-toe.enum';
import { v4 as uuidv4 } from 'uuid';
import { gameHistoryStorage, gameStorage } from '../storage/storage';
import { JoinGameInput } from '../resolvers/types/join-game.input';
import { MakeMoveInput } from '../resolvers/types/make-move.input';
import { Winner } from '../enums/winner.enum';
import { GameplayService } from './gameplay.service';
import { Constants } from '../constants/constants';
import { GameHistory } from '../schema/game-history.schema';
import logger from '../../config/logger';
import { pubsub } from '../publisher';
import { Move } from '../models/move';

const NAMESPACE = 'GameService';

@Service()
export class GameService {
  constructor(private gameplayService: GameplayService) {}

  async createGame(input: CreateGameInput): Promise<Game> {
    const game = new Game();

    game._id = uuidv4().toString();
    game.isSingleplayer = input.isSingleplayer;
    game.gameStatus = this.getGameStatus(input.isSingleplayer);
    game.winner = Winner.NONE;
    game.playerName1 = input.playerName1;
    game.board = this.gameplayService.initializeBoard();

    gameStorage.set(game._id, game);

    return game;
  }

  async joinGame(input: JoinGameInput): Promise<Game> {
    const game = gameStorage.get(input.gameId);

    this.validateIfUserCanJoinTheGame(input.gameId, input.playerName2, game);

    game!!.gameStatus = GameStatus.IN_PROGRESS;
    game!!.winner = Winner.NONE;
    game!!.playerName2 = input.playerName2;
    gameStorage.set(game!!._id, game!!);

    return game!!;
  }

  async makeMove(input: MakeMoveInput): Promise<Game> {
    const game = gameStorage.get(input.gameId);

    this.validateIfUserCanMakeMove(input, game);

    game!!.board[input.move.coordinateX][input.move.coordinateY] = input.ticToe;

    game!!.winner = this.gameplayService.evaluateGame(game!!.board);

    if (game!!.isSingleplayer && game!!.winner === Winner.NONE) {
      const aiMove = this.gameplayService.findBestMove(game!!.board);

      game!!.board[aiMove.coordinateX][aiMove.coordinateY] = TicToe.O;

      game!!.winner = this.gameplayService.evaluateGame(game!!.board);
    }

    if (game!!.winner !== Winner.NONE) {
      game!!.gameStatus = GameStatus.FINISHED;
    }

    const numberOfGamesInStorage = this.saveGame(game!!);

    pubsub.publish(Constants.GAMES_TOPIC, { id: numberOfGamesInStorage, message: game!!.toString() });

    return game!!;
  }

  async getGameHistory(gameId: string): Promise<[GameHistory]> {
    const gameHistory = gameHistoryStorage.get(gameId);
    if (gameHistory) return gameHistory;

    const errorMessage = `Game history for game with id: ${gameId} was not found. Either the game has just started or the provided gameId is not valid.`;

    logger.error(NAMESPACE, errorMessage);
    throw new Error(errorMessage);
  }

  private validateIfUserCanJoinTheGame(gameId: string, playerName2: string, game?: Game) {
    if (!game) {
      const error = `Game with ID: ${gameId} does not exist.`;

      logger.error(NAMESPACE, error);
      throw new Error(error);
    }

    if (game.gameStatus === GameStatus.IN_PROGRESS) {
      const error = `Can not join game in progress!`;

      logger.error(NAMESPACE, error);
      throw new Error(error);
    }

    if (this.validateInputData(game.playerName1, playerName2)) {
      const error = `Player names must be different!`;

      logger.error(NAMESPACE, error);
      throw new Error(error);
    }
  }

  private validateIfUserCanMakeMove(input: MakeMoveInput, game?: Game) {
    if (!game) {
      const error = `Game with ID: ${input.gameId} does not exist.`;

      logger.error(NAMESPACE, error);
      throw new Error(error);
    }

    if (!game.playerName2 && !game.isSingleplayer) {
      const error = `Player two must join the game.`;

      logger.error(NAMESPACE, error);
      throw new Error(error);
    }

    if (game.gameStatus === GameStatus.FINISHED) {
      const error = `Game is already finished!`;

      logger.error(NAMESPACE, error);
      throw new Error(error);
    }

    if (game.board[input.move.coordinateX][input.move.coordinateY] !== Constants.EMPTY_FIELD) {
      const error = `Can not repeat the move.`;

      logger.error(NAMESPACE, error);
      throw new Error(error);
    }

    if (this.gameplayService.getPlayerOnTheMove(game.board) !== input.ticToe) {
      const error = `Player ${input.ticToe} is not on the move.`;

      logger.error(NAMESPACE, error);
      throw new Error(error);
    }
  }

  private saveGame(game: Game): number {
    const gameMove = new GameHistory();

    gameMove.board = this.copy2DArray(game.board);
    gameMove.gameStatus = game.gameStatus;
    gameMove.winner = game.winner;

    const savedGameHistory = gameHistoryStorage.get(game._id);

    if (savedGameHistory) {
      savedGameHistory.push(gameMove);
      return savedGameHistory.length;
    }

    gameHistoryStorage.set(game._id, [gameMove]);
    return 1;
  }

  private copy2DArray(board: string[][]): string[][] {
    const length = board.length;
    const copy = new Array(length);
    for (let i = 0; i < length; ++i) {
      copy[i] = board[i].slice(0);
    }
    return copy;
  }

  private getGameStatus(isSingleplayer: boolean) {
    if (isSingleplayer) {
      return GameStatus.IN_PROGRESS;
    } else {
      return GameStatus.CREATED;
    }
  }

  private validateInputData(playerName1: string, playerName2: string): boolean {
    return playerName1 === playerName2;
  }
}
