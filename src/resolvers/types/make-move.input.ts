import { InputType, Field, Int } from 'type-graphql';
import { TicToe } from '../../enums/tic-toe.enum';
    
@InputType()
export class MakeMoveInput {
    @Field(() => String)
    gameId: string;
    
    @Field(() => TicToe)
    ticToe: TicToe;

    @Field(() => Int)
    coordinateX: number;

    @Field(() => Int)
    coordinateY: number;
}