import FileStore from './FileStore.js';

export default class BaseJsonFileHandler	{

	constructor(filename)	{

		this.configFile = filename;

		// var fileStore = new FileStore();
		// this.config = fileStore.getFileAsJson(this.configFile);
		// if (this.config == null)	{
		// 	this.config = {};
		// }
			this.load();

	}

	load()	{

		var fileStore = new FileStore();
		this.config = fileStore.getSettingsFileAsJson(this.configFile);
		if (this.config == null)	{
			this.config = {};
		}

	}

	save()	{
		var fileStore = new FileStore();
		fileStore.setFile(this.configFile, JSON.stringify(this.config));
	}

	getConfig()	{
		return this.config;
	}

	setConfig(newConfig)	{
		this.config = newConfig;
		var fileStore = new FileStore();
		fileStore.setSettingsFile(this.configFile, JSON.stringify(newConfig));
	}

}
