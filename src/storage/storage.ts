import { GameHistory } from "../schema/game-history.schema";
import { Game } from "../schema/game.schema";

export let gameStorage: Map<string, Game> = new Map<string, Game>();

export let gameHistoryStorage: Map<string, [GameHistory]> = new Map<string, [GameHistory]>();