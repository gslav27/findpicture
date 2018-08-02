import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';

import { Provider } from 'react-redux';
import store, { history } from './store/store';
import { Router, Route } from 'react-router';
// import { BrowserRouter as Router, Route } from 'react-router-dom'

ReactDOM.render(
  <Provider store={store}>
    <Router history={history}>
      <App />
    </Router>
  </Provider>
  ,
  document.getElementById('root')
);
registerServiceWorker();