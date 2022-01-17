import dotenv from "dotenv";
dotenv.config();
import "reflect-metadata";
import express from "express";
import { buildSchema } from "type-graphql";
import { ApolloServer } from "apollo-server-express";
import { 
  ApolloServerPluginLandingPageGraphQLPlayground
} from "apollo-server-core";
import { connectToMongo } from "./utils/mongo";
import { Container } from "typedi";
import GameResolver from "./resolvers/game.resolver";

async function bootstrap() {
  // Build the schema
  const schema = await buildSchema({
    resolvers: [GameResolver],
    container: Container
  });

  // Init express
  const app = express();

  // Create the apollo server
  const server = new ApolloServer({
    schema,
    plugins: [
    ApolloServerPluginLandingPageGraphQLPlayground()
    ]
  });

  await server.start();

  // Apply middleware to server
  server.applyMiddleware({ app });

  // app.listen on express server
  app.listen({ port: 5000 }, () => {
    console.log("App is listening on http://localhost:5000");
  });

  //Connect to Mongo DB
  connectToMongo();
}

bootstrap();
