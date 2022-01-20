import { registerEnumType } from "type-graphql";

export enum Winner {
    TIE = "-",
    X = "X",
    O = "O",
    NONE = "_"
}

registerEnumType(Winner, {
    name: "Winner"
});