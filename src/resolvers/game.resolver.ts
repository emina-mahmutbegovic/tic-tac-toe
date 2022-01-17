import { Arg, Mutation, Resolver, Query } from "type-graphql";
import { Service } from "typedi";
import { Game } from "../schema/game.schema";
import { GameService } from "../service/game.service";
import { CreateGameInput } from "./types/create-game.input";
import { JoinGameInput } from "./types/join-game.input";
import { MakeMoveInput } from "./types/make-move.input";

@Service()
@Resolver()
export default class GameResolver {
  constructor(private gameService: GameService) { }

  @Query(() => String)
  healthcheck() { return "App sucessfully running!";}

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
    return await this.gameService.makeMove(input);
  }
}