import { registerEnumType } from "type-graphql";

export enum TicToe {
    X = "X",
    O = "O",
}

registerEnumType(TicToe, {
    name: "TicToe"
});