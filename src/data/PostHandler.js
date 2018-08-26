var axios = require('axios');

export default class PostHandler	{

	constructor()	{
		this.url = 'http://localhost/inforama7.1/studio/sync/';
	}

	dopost(module, funcname, postdata, callback)	{

		var posturl = this.url;
		switch (module)	{
			case 'user':
				posturl += 'login.php';
				break;
			case 'sync':
				posturl += 'sync.php';
				break;
			default:
				break;
		}

		var postObj = {'action':funcname, data:postdata};

		if (module !== 'user')	{
			postObj.sessionid = global.InforamaConfig.getSession().getSessionId();
		}

		axios.post(posturl, postObj).then(function (response) {
			console.log(response.status);
			if (callback)	{
				callback(response.data);
			}
	  	}).catch(function (error) {
	    	console.log(error);
		});

	}

}
