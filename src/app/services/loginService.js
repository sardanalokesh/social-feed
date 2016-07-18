app.service("loginService", function(util, constants) {

	var service = this;

	service.login = function(user) {
		return util.ajaxPost(constants.LOGIN_PATH, user);
	};

	service.logout = function(user) {
		return util.ajaxPost(constants.LOGOUT_PATH, user);
	};

	service.register = function() {
		//code for registering a new user will go here
	};
	
});