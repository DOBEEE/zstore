import models from './models';
import { createStore } from '@sstore/core';

export default () => {
  const store = createStore<typeof models>({
    models,
    globalSpace: window.SN,
    middlewares: [
      ({getState}) => (next) => (action) => {
        console.log(action);
        next(action);
      }
    ]
  });
  return store;
};
