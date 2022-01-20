import { Field, ObjectType, ID, Int } from "type-graphql";
import { GameStatus } from "../enums/game-status.enum";
import { Winner } from "../enums/winner.enum";
  
@ObjectType()
export class GameHistory {
    @Field(() => ID)
    _id: number;
      
    @Field(() => GameStatus)
    gameStatus: GameStatus;

    @Field(() => [[String]])
    board: string[][];
  
    @Field(() => Winner)
    winner: Winner;
}