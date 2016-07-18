app.service('authInterceptor', function($q, $rootScope, eventService, constants, store) {
	
	this.request = function(config) {
		var currentUser = store.get("user"),
		access_token = currentUser ? currentUser.access_token : null;
		if (access_token) {
			config.headers.authorization = access_token;
		}
		var canceler = $q.defer();
    	config.timeout = canceler.promise;

    	//cancel the request if no access token is present
    	if (!access_token && config.url == constants.QUERY_ENGINE_URL)
    		canceler.resolve();

		return config;
	};
	
	this.responseError = function(response) {
		if (response.status === 401) {
			eventService.publish("unauthorized");
		}
		return response;
	};
});