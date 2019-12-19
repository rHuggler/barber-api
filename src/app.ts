import 'reflect-metadata';

import * as Sentry from '@sentry/node';
import express, { Application } from 'express';
import mongoose from 'mongoose';
import { resolve } from 'path';
import { createConnection } from 'typeorm';

import 'dotenv/config';
import 'express-async-errors';

import youch from './app/middlewares/error';
import { mongoConfig, postgresConfig } from './config/database';
import sentryConfig from './config/sentry';
import routes from './routes';

class App {
  server: Application;

  constructor() {
    this.server = express();

    Sentry.init(sentryConfig);

    this.databases();
    this.middlewares();
  }

  private databases(): void {
    createConnection(postgresConfig);
    mongoose.connect(mongoConfig.uri, mongoConfig.options);
  }

  private middlewares(): void {
    this.server.use(Sentry.Handlers.requestHandler());
    this.server.use(express.json());
    this.server.use('/files', express.static(resolve(__dirname, '..', 'tmp', 'uploads')));
    this.routes();
    this.server.use(Sentry.Handlers.errorHandler());
    this.server.use(youch);
  }

  private routes(): void {
    this.server.use(routes);
  }
}

export default new App().server;
