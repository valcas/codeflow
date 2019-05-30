import store from '../redux/CodeflowStore';
import BaseJsonFileHandler from '../file/BaseJsonFileHandler.js';

const fs = window.require('fs');

export default class Settings extends BaseJsonFileHandler {

	constructor()	{

		super("settings.json");
    if (this.config.listenport == null)  {
      this.setConfig({listenport:8081, listening: true});
    }

    store.dispatch({type: 'SETTINGS_LOADED', payload: this.config});

    this.createSettingListener();

  }
  
  createSettingListener() {

    var _this = this;
    window.addEventListener('settingChanged', function (e) { 
      _this.setConfig(e.detail);
    }, false);

  }

}
