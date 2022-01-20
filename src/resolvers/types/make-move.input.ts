import { InputType, Field, Int } from 'type-graphql';
import { TicToe } from '../../enums/tic-toe.enum';
import { Move } from '../../models/move';
    
@InputType()
export class MakeMoveInput {
    @Field(() => String)
    gameId: string;
    
    @Field(() => TicToe)
    ticToe: TicToe;

    @Field(() => Move)
    move: Move;
}