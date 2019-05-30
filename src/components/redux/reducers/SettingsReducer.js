const fs = window.require('fs');
const JsonConfig = window.require('json-config/lib/json-config').default;

const initialState = {
  listenport: 8081,
  listening: true,
  projects:[],
  mru:[]
};

const settingsReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'SETTINGS_LOADED':
      var settings = action.payload;
      loadProjectLocations(settings);
      return {settings:settings};
    case 'SET_LISTENING_STATE':
      var settings = JSON.parse(JSON.stringify(state.settings));
      settings.listening = action.payload;
      return {settings:settings};
    case 'SET_LISTENING_PORT':
      var settings = JSON.parse(JSON.stringify(state.settings));
      settings.listenport = action.payload;
      return {settings:settings};
    case 'LOAD_PROJECT_FOLDER':
      var settings = JSON.parse(JSON.stringify(state.settings));
      settings.projects = settings.projects ? settings.projects : [];
      var project = {location:action.payload.location};
      settings.projects.push(project);
      loadProjectLocations(settings);
      addMruItem(settings, project.location);
      saveSettings(settings);
      return {settings:settings};
    case 'RELOAD_PROJECT':

        var settings = JSON.parse(JSON.stringify(state.settings));
        var cfg = new JsonConfig(settings);

        var project = cfg.getValue(`projects/[location=${action.payload.projectPath}]`);
        loadProjectFiles(project[0]);
        return {settings:settings};

    case 'CLOSE_PROJECT':
        var settings = JSON.parse(JSON.stringify(state.settings));
        settings.projects.map((project, index) => {
          if (project.location == action.payload.project.location)  {
            console.log('need to remove project');
            settings.projects.splice(index, 1);
          }
        });
        return {settings:settings};

    default:
      return state;
  }

};

const addMruItem = (settings, location) =>  {

  settings.mru = settings.mru ? settings.mru : []
  
  settings.mru.map((mruItem, index) => {
    if (location == mruItem)  {
      settings.mru.splice(index, 1);
    }
  })

  settings.mru.unshift(location);

  if (settings.mru.length > 10) {
    settings.mru.splice(10);
  }

}

const saveSettings = (settings) => {
  var event = new CustomEvent('settingChanged', {detail: settings});
  window.dispatchEvent(event);
}

const loadProjectLocations = (settings) =>  {

    settings.projects.map(project => {
      loadProjectFiles(project);
    });

}

const loadProjectFiles = (project) =>  {

  var files = fs.readdirSync(project.location);

  project.files = [];
    
  for(let filePath of files) {
    if (filePath.indexOf('.') > -1) {
      if (filePath.substring(filePath.indexOf('.'), filePath.length).toUpperCase().endsWith('.XML'))  {
        project.files.push({type:'graph', path:filePath});
      }
    } else {
      if (filePath == 'sessions') {
        var folderObj = {type:'folder', key:'sessions', path:filePath, files:[]};
        project.files.push(folderObj);
        var sessionFiles = fs.readdirSync(project.location + '\\sessions\\');
        for(let sessionFile of sessionFiles) {
          folderObj.files.push(sessionFile);
        }
      }
    }
  }

}


export default settingsReducer;
