import { MinLength, MaxLength } from 'class-validator';
import { InputType, Field } from 'type-graphql';
import { Game } from '../../schema/game.schema';
    
@InputType()
export class JoinGameInput implements Partial<Game> {
    @Field(() => String)
    gameId: string;

    @MinLength(3, {
        message: "Player name must be at least 3 characters long",
    })
    @MaxLength(15, {
        message: "Player name must not be longer than 15 characters",
    })
    @Field(() => String)
    playerName2: string;
}