import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import './index.css';
import createStore from './store';
window.store = createStore();

ReactDOM.render(
  // <React.Fragment>
  <App />,
  // </React.Fragment>,
  document.getElementById('root'),
);
