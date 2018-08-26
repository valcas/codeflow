import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import GraphRenderer from './ui/graph/GraphRenderer';
import LeftPanel from './ui/LeftPanel';
import DynagramServer from './server/DynagramServer';
import App from './App';
import {Provider} from 'react-redux';
import store from './redux/DynagramStore';

// var server = new DynagramServer();

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root'));
