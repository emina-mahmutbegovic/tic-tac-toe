import { registerEnumType } from "type-graphql";

export enum TicToe {
    TIE,
    X,
    O,
    UNDEFINED
}

registerEnumType(TicToe, {
    name: "TicToe"
});