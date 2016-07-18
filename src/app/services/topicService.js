app.service("topicService", function(util, constants) {

	var allTopics = null;
	
	this.getAllTopics = function(callback) {
		if (!allTopics) {
		util.ajaxGet(constants.TOPICS_LIST)
			.then(function(data) {
				allTopics = data;
				callback(allTopics);
			});
		} else {
			callback(allTopics);
		}
	};
});