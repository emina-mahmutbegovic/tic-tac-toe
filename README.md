# Tic-Tac-Toe API with TypeGraphQL, TypeGoose, TypeScript and Apollo Server

### About
This basic Tic-Tac-Toe API was implemented with NodeJS, TypeGraphQL, TypeGoose, TypeScript and Apollo Server. It supports both singleplayer and multiplayer mode. Singleplayer mode uses Minimax algorithm to generate opponent's moves. This solution does not have integrated database. Data is stored in map objects.

### References
* [TypeGraphQL](https://typegraphql.com/)
* [TypeGoose](https://typegoose.github.io/typegoose/)
* [Apollo Server](https://www.apollographql.com/docs/apollo-server/)
* [Minimax](https://www.geeksforgeeks.org/minimax-algorithm-in-game-theory-set-3-tic-tac-toe-ai-finding-optimal-move/)

### Prerequisites
 - node, npm (https://docs.npmjs.com/downloading-and-installing-node-js-and-npm)

### Running the application
 - Use [npm install] to install dependencies
 - Use [npm run dev] to run the application

### Application URL
http://localhost:5000/graphql

### Note
Application uses port 5000 so make sure it is free, or change the port number in 
config -> config.ts. Configure the port number in the URL above accordingly.

---

## Gameplay

### Queries & mutations

### Healthcheck 
Can be used to check if the application has successfully started. 

Query
```
query{
  healthcheck
}
```

Response
```
{
  "data": {
    "healthcheck": "App sucessfully running!"
  }
}
```

### Create game 
Used for the game creation. Based on the isSingleplayer parameter, it can be singleplayer or multiplayer. Returns created game.

Query
```
mutation($input: CreateGameInput!) {
  createGame(input: $input) {
    _id
    playerName1
    playerName2
    isSingleplayer
    gameStatus
    board
    winner
  }
}
```
Input
```
{
  "input": {
    "playerName1": "string", 
    "isSingleplayer": false  # Should be set to true or false. This parameter is used as a switch between singleplayer and multiplayer modes.
  }
}
```

### Join game 
Can be used by player two to join the game, if it was created as multiplayer. Returns game on which player has joined.

Query
```
mutation($input: JoinGameInput!) {
  joinGame(input: $input) {
    _id
    playerName1
    playerName2
    isSingleplayer
    gameStatus
    board
    winner
  }
}
```

Input
```
{
  "input": { 
    "gameId": "someGameId", #_id parameter which was returned by createGame mutation 
    "playerName2": "string2" # must differ from playerName1, otherwise, mutation throws an error
  }
}
```

### Make move 
Used for making the game move. Saves game. Publishes latest game to the GAMES topic. Returns game object after the made move. 

Query
```
mutation($input: MakeMoveInput!) {
  makeMove(input: $input) {
    _id
    playerName1
    playerName2
    isSingleplayer
    gameStatus
    board
    winner
  }
}
```

Input
```
{ "input": 
  {
      "gameId": "someGameId", # valid _id from the existing game must be provided
      "ticToe": "X", # can be X for singleplayer and X or O for multiplayer mode. 
      "move": { # board coordinates. Board is represented as a matrix. 
        "coordinateX": 0,
        "coordinateY": 1
      }
  }
}
```

### Get game history 
Used for the insight of previous game moves and statuses. Returns an array of games for the provided game id.

Query
```
query {
  getGameHistory(gameId: "validGameId") {
    _id
    gameStatus
    board
    winner
  }
}
```

## Subscription 
Should be used to access live game information that is produced when players are making new moves. This one was not tested so it might not work.

Subscription
```
subscription{
  getLiveResults{
    message
  }
}
```

## Complete GraphQL Schema
```
type Query {
  healthcheck: String!
  getGameHistory(gameId: String!): [GameHistory!]!
}
```

```
type GameHistory {
  _id: ID!
  gameStatus: GameStatus!
  board: [[String!]!]!
  winner: Winner!
}
```

```
enum GameStatus {
  CREATED
  IN_PROGRESS
  FINISHED
}
```

```
enum Winner {
  TIE
  X
  O
  NONE
}
```

```
type Mutation {
  createGame(input: CreateGameInput!): Game!
  joinGame(input: JoinGameInput!): Game!
  makeMove(input: MakeMoveInput!): Game!
}
```

```
type Game {
  _id: ID!
  playerName1: String!
  playerName2: String
  isSingleplayer: Boolean!
  gameStatus: GameStatus!
  board: [[String!]!]!
  winner: Winner!
}
```

```
input CreateGameInput {
  playerName1: String!
  isSingleplayer: Boolean!
}
```

```
input JoinGameInput {
  gameId: String!
  playerName2: String!
}
```

```
input MakeMoveInput {
  gameId: String!
  ticToe: TicToe!
  move: Move!
}
```

```
enum TicToe {
  X
  O
}
```

```
input Move {
  coordinateX: Int!
  coordinateY: Int!
}
```

```
type Subscription {
  getLiveResults: GamePayload!
}
```

```
type GamePayload {
  id: Int!
  message: String
}
```

## Future work ideas
- Optimize gameplay algorithms. Current implementation consists of nested loops which should be replaced with a better solution.
- Write unit and integration tests.
- Integrate database into the application.
