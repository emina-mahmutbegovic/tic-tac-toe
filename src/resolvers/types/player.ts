import { MinLength, MaxLength } from 'class-validator';
import { Field, ObjectType } from 'type-graphql';
import { TicToe } from '../../enums/tic-toe.enum';

@ObjectType()
export class Player {
    @MinLength(3, {
        message: "Player name must be at least 3 characters long",
    })
    @MaxLength(15, {
        message: "Player name must not be longer than 15 characters",
    })
    @Field(() => String)
    name: string;

    @Field(() => TicToe)
    ticToe: TicToe;
}