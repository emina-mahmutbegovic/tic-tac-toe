import 'reflect-metadata';
import express from 'express';
import { buildSchema } from 'type-graphql';
import { ApolloServerPluginLandingPageGraphQLPlayground } from 'apollo-server-core';
import { Container } from 'typedi';
import GameResolver from './resolvers/game.resolver';
import config from '../config/config';
import logger from '../config/logger';
import { ApolloServer } from 'apollo-server-express';

const NAMESPACE = 'Server';

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
        plugins: [ApolloServerPluginLandingPageGraphQLPlayground()]
    });

    await server.start();

    // Apply middleware to server
    server.applyMiddleware({ app });

    // app.listen on express server
    app.listen({ port: config.server.port }, () => {
        logger.info(NAMESPACE, `Server is running on ${config.server.hostname}:${config.server.port}`);
    });
}

bootstrap();
