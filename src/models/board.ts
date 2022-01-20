// These objects refer to an idea to skip nested loops via some form of object/map that represents a board.
// Key of that map should be coordinates of the board [coordinateX: number, coordinateY: number],
// while value is 'X', 'O', or an empty field '_'
// It wasn't implemented fully because I couldn't (or didn't know how to) define GraphQL API return value
// with these objects :). I found somewhere that GraphQL doesn't support Map type
/*
export interface Board {
    [coordinates: string]: string
};

@InputType()
export class Board2 {
    fields: Map<Move, string> = new Map();

    constructor() {
        this.initializeBoard();
    }

    initializeBoard() {
        for(let i = 0; i < 3; ++i) {
            for(let j = 0; j < 3; ++j) {
                this.fields.set(new Move(i, j), Constants.EMPTY_FIELD);
            }
        }
    }

    setBoardFieldValue(coordinates: Move, value: string) {
        this.fields.set(coordinates, value);
    }

    getBoardFieldValue(coordinateX: number, coordinateY: number): string {
        const coordinates = new Move(coordinateX, coordinateY);
        try {
            return this.fields.get(coordinates)!!;
        } catch(error) {
            logger.error("Board2", `Invalid coordinates. Coordinate values: (${coordinates.coordinateX}, ${coordinates.coordinateY}`, error);
            throw error;
        }
    }
}*/
