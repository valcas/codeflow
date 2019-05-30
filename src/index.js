import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/App';
import {Provider} from 'react-redux';
import store from './components/redux/CodeflowStore';

let root = document.createElement('div')

root.id = 'root'
document.body.appendChild(root)

// Now we can render our application into it
ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
	document.getElementById('root'))
