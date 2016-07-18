app.service("userService", function(store, constants, util) {
	
	var currentUser = null;
	var userDetails = null;

	this.setCurrentUser = function(user) {
		currentUser = user;
		if (currentUser)
			delete currentUser.password;// don't store password
		store.set('user', user);
		return currentUser;
	};

	this.getCurrentUser = function() {
		if (!currentUser) {
		currentUser = store.get('user');
		}
		return currentUser;
	};

	this.getUserDetails = function(callback) {
		if (!userDetails) {
			var url = constants.USER_INFO_URL + "userName=" + currentUser.username;
			util.ajaxGet(url).then(function(data) {
				userDetails = data;
				callback(userDetails);
			});
		} else {
			callback(userDetails);
		}
	};
});