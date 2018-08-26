import store from '../redux/DynagramStore';
import BaseJsonFileHandler from '../file/BaseJsonFileHandler.js';
import FileStore from '../file/FileStore.js';
import {connect} from 'react-redux'
import compose from 'recompose/compose';

const fs = window.require('fs');

export default class Settings extends BaseJsonFileHandler {

	constructor()	{

		super("settings.json");
    if (this.config.listenport == null)  {
      this.setConfig({listenport:8081, listening: true});
    }

    store.dispatch({type: 'SETTINGS_LOADED', payload: this.config});

	}

}
