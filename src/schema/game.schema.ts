import {
    prop as Property,
  } from "@typegoose/typegoose";
import { Field, ObjectType, ID, Int } from "type-graphql";
import { GameStatus } from "../enums/game-status.enum";
import { Winner } from "../enums/winner.enum";
  
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

    @Field(() => [[String]])
    board: string[][];
  
    @Field(() => Winner)
    winner: Winner;
}