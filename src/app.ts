import 'reflect-metadata';

import express, { Application } from 'express';
import { createConnection } from 'typeorm';

import routes from './routes';

class App {
  server: Application;

  constructor() {
    this.server = express();

    this.database();
    this.middlewares();
    this.routes();
  }

  private async database(): Promise<void> {
    try {
      await createConnection();
    } catch (err) {
      console.error(err);
    }
  }

  private middlewares(): void {
    this.server.use(express.json());
  }

  private routes(): void {
    this.server.use(routes);
  }
}

export default new App().server;
