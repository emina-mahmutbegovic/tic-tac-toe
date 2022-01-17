import {
    prop as Property,
  } from "@typegoose/typegoose";
import { Field, ObjectType, ID, Int } from "type-graphql";
import { GameStatus } from "../enums/game-status.enum";
import { TicToe } from "../enums/tic-toe.enum";
import { Player } from "../resolvers/types/player";
  
@ObjectType()
export class Game {
    @Field(() => ID)
    _id: string;

    @Field(() => String)
    @Property({ required: true})
    playerName1: string;

    @Field(() => String, { nullable: true })
    @Property({ unique: false})
    playerName2: string;

    @Field(() => Boolean)
    isSingleplayer: boolean;
      
    @Field(() => GameStatus)
    gameStatus: GameStatus;

    @Field(() => [[Int]])
    board: number[][];
  
    @Field(() => TicToe)
    winner: TicToe;
}
  
//export const GameModel = getModelForClass<typeof Game>(Game);