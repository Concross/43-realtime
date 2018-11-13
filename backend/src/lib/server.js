'use strict';

import cors from 'cors';
import morgan from 'morgan';
import { Server } from 'http';
import express from 'express';
import * as mongo from './mongo';
import io from './io';

import authRouter from '../router/auth';
import fourOhFour from '../middleware/four-oh-four';
import errorHandler from '../middleware/error-middleware';

import authSubscriber from '../subscribe/auth';
import messageSubscriber from '../subscribe/message.js';

const app = express();

app.use(morgan('dev'));
app.use(cors({
  origin: process.env.CORS_ORIGINS.split(' '),
  credentials: true,
}));

app.use(authRouter);
app.use(fourOhFour);
app.use(errorHandler);

const state = {
  isOn: false,
  http: null,
}

export const start = () => {
  return new Promise((resolve, reject) => {
    if (state.isOn) reject(new Error('USAGE ERROR: the state is on'));

    mongo.start()
      .then(() => {
        state.http = Server(app);
        state.isOn = true;

        let subscribers = Object.assign(authSubscriber, messageSubscriber);
        io(state.http, subscribers);

        state.http.listen(process.env.PORT, () => {
          console.log('__SERVER_UP__', process.env.PORT);
          resolve();
        });
      });
  });
}

export const stop = () => {
  return new Promise((resolve, reject) => {
    if (!state.isOn) reject(new Error('USAGE ERROR: the state is off'));

    return mongo.stop()
      .then(() => {
        state.http.close(() => {
          console.log('__SERVER_DOWN__');
          state.isOn = false;
          state.http = null;
          resolve();
        });
      })
      .catch(reject);
  });
}
