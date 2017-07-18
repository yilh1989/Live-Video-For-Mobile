import React from 'react';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware, compose } from 'redux';
import { persistStore } from 'redux-persist';
import thunkMiddleware from 'redux-thunk';
import rootReducer from './model/reducer';
import App from './app';

const store = DEBUG ? createStore(
  rootReducer,
  compose(
    applyMiddleware(thunkMiddleware),
    window.devToolsExtension ? window.devToolsExtension() : f => f
  ),
  // autoRehydrate()
) : createStore(rootReducer, applyMiddleware(thunkMiddleware));

persistStore(store, { whitelist: ['appInfo'] });

const StoreWrap = () => <Provider store={store}><App /></Provider>;
export default StoreWrap;
