import { registerEnumType } from "type-graphql";

export enum Score {
    X = 10,
    O = -10,
    NONE = 0
}

registerEnumType(Score, {
    name: "Score"
});