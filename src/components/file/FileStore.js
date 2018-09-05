const electron = window.require('electron');
const fs = window.require('fs');

class FileStore {

  constructor(opts) {
    this.mkdir('');
  }

  getProjectsDirectory()  {
    return (electron.app || electron.remote.app).getPath('userData');
  }

  mkdir(dir) {

    var pathitems = dir.split('\\');
    var fullpath = this.getProjectsDirectory();

    for (var i = 0; i < pathitems.length; i++)  {
      fullpath += '\\' + pathitems[i];
      if ( ! fs.existsSync(fullpath)) {
        fs.mkdirSync(fullpath);
      }
    }

  }

  getFile(path) {
    try {
      return fs.readFileSync(path, 'utf-8');
    } catch(e) {
      console.log('Failed to save the file !\n\n' + e.message );
    }
  }

  getSettingsFile(path) {
    var appPath = this.getProjectsDirectory() + "\\" + path;
    try {
      return fs.readFileSync(appPath, 'utf-8');
    } catch(e) {
      console.log('Failed to save the file !\n\n' + e.message );
    }
  }

  getFileAsJson(path) {
    var contents = this.getFile(path);
    if (contents != null) {
      return JSON.parse(contents);
    }
  }

  getSettingsFileAsJson(path) {
    var contents = this.getSettingsFile(path);
    if (contents != null) {
      return JSON.parse(contents);
    }
  }

  getAppFileAsJson(path) {
    var appPath = this.getProjectsDirectory() + "\\" + path;
    return this.getFileAsJson(appPath);
  }

  setFile(path, content) {
    try {
      fs.writeFileSync(path, content, 'utf-8');
    }
      catch(e) { console.log('Failed to save the file !\n\n' + e.message );
    }
  }

  setSettingsFile(path, content) {
    var appPath = this.getProjectsDirectory() + "\\" + path;
    try {
      fs.writeFileSync(appPath, content, 'utf-8');
    }
      catch(e) { console.log('Failed to save the file !\n\n' + e.message );
    }
  }

  setAppFile(path, content) {

    var appPath = this.getProjectsDirectory() + "\\" + path;
    this.setFile(appPath, content);

  }

  // This will just return the property on the `data` object
  get(key) {
    return this.data[key];
  }

  set(key, val) {
    this.data[key] = val;
    fs.writeFileSync(this.path, JSON.stringify(this.data));
  }
}

function parseDataFile(filePath, defaults) {
  // We'll try/catch it in case the file doesn't exist yet, which will be the case on the first application run.
  // `fs.readFileSync` will return a JSON string which we then parse into a Javascript object
  try {
    return JSON.parse(fs.readFileSync(filePath));
  } catch(error) {
    // if there was some kind of error, return the passed in defaults instead.
    return defaults;
  }
}

// expose the class
module.exports = FileStore;
