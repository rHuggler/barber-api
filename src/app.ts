import 'reflect-metadata';

import express, { Application } from 'express';

import { resolve } from 'path';
import routes from './routes';

class App {
  server: Application;

  constructor() {
    this.server = express();

    this.middlewares();
    this.routes();
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
