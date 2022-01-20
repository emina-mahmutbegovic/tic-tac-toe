import { Arg, Mutation, Resolver, Query, Subscription, Root, PubSub, Publisher, PubSubEngine } from 'type-graphql';
import { Service } from 'typedi';
import { Constants } from '../constants/constants';
import { GameHistory } from '../schema/game-history.schema';
import { Game } from '../schema/game.schema';
import { GameService } from '../service/game.service';
import { CreateGameInput } from './types/create-game.input';
import { GamePayload } from './types/game-payload';
import { JoinGameInput } from './types/join-game.input';
import { MakeMoveInput } from './types/make-move.input';

@Service()
@Resolver()
export default class GameResolver {
  constructor(private gameService: GameService) {}

  @Query(() => String)
  healthcheck() {
    return 'App sucessfully running!';
  }

  @Query(() => [GameHistory])
  async getGameHistory(@Arg('gameId') gameId: string): Promise<[GameHistory]> {
    return await this.gameService.getGameHistory(gameId);
  }

  @Mutation(() => Game)
  async createGame(@Arg('input') input: CreateGameInput): Promise<Game> {
    return await this.gameService.createGame(input);
  }

  @Mutation(() => Game)
  async joinGame(@Arg('input') input: JoinGameInput): Promise<Game> {
    return await this.gameService.joinGame(input);
  }

  @Mutation(() => Game)
  async makeMove(@Arg('input') input: MakeMoveInput): Promise<Game> {
    return this.gameService.makeMove(input);
  }

  @Subscription({ topics: Constants.GAMES_TOPIC })
  getLiveResults(@Root() gamePayload: GamePayload): GamePayload {
    return gamePayload;
  }
}
