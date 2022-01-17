import { MinLength, MaxLength } from 'class-validator';
import { InputType, Field } from 'type-graphql';
import { Game } from '../../schema/game.schema';
import { Player } from './player';

@InputType()
export class CreateGameInput implements Partial<Game> {
    @MinLength(3, {
        message: "Player name must be at least 3 characters long",
    })
    @MaxLength(15, {
        message: "Player name must not be longer than 15 characters",
    })
    @Field(() => String)
    playerName1: string;

    @Field(() => Boolean)
    isSingleplayer: boolean;
}