'use strict';

const mongoose = require('mongoose');
mongoose.Promise = Promise;

const state = {
  isOn: false,
  config: {
    useMongoClient: true,
    promiseLibrary: Promise,
  },
}

export const start = () => {
  if (state.isOn) Promise.reject(new Error('USER ERROR: db is connected'));

  return mongoose.connect(process.env.MONGODB_URI, state.config)
    .then(() => {
      console.log('__MONGO_CONNECTED__', process.env.MONGODB_URI);
      state.isOn = true;
    });
}

export const stop = () => {
  if (!state.isOn) Promise.reject(new Error('USER ERROR: db is disconnected'));

  return mongoose.disconnect()
    .then(() => {
      state.isOn = false;
      console.log('__MONGO_DISCONNECTED__')
    });
}