import { Field, InputType, Int } from "type-graphql";

@InputType()
export class Move {
    @Field(() => Int)
    coordinateX: number;
    @Field(() => Int)
    coordinateY: number;

    constructor(coordinateX: number, coordinateY: number) {
        this.coordinateX = coordinateX;
        this.coordinateY = coordinateY;
    }
}