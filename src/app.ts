import 'reflect-metadata';

import express, { Application } from 'express';
import mongoose from 'mongoose';
import { resolve } from 'path';
import { createConnection } from 'typeorm';

import { mongoConfig, postgresConfig } from './config/database';
import routes from './routes';

class App {
  server: Application;

  constructor() {
    this.server = express();

    this.databases();
    this.middlewares();
    this.routes();
  }

  private databases(): void {
    createConnection(postgresConfig);
    mongoose.connect('mongodb://localhost/barber', mongoConfig);
  }

  private middlewares(): void {
    this.server.use(express.json());
    this.server.use('/files', express.static(resolve(__dirname, '..', 'tmp', 'uploads')));
  }

  private routes(): void {
    this.server.use(routes);
  }
}

export default new App().server;
