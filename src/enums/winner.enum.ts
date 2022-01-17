import { registerEnumType } from "type-graphql";

export enum Winner {
    X = 10,
    O = -10
}

registerEnumType(Winner, {
    name: "Winner"
});