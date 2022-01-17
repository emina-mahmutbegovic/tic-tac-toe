import { registerEnumType } from "type-graphql";

export enum GameStatus {
    CREATED,
    IN_PROGRESS,
    FINISHED
}

registerEnumType(GameStatus, {
    name: "GameStatus"
});