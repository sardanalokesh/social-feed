app.controller("LoginCtrl", function($scope, $location, $state, util, constants, loginService, userService, eventService) {

	$scope.fieldNames = {
		userEmail: "Email",
		userPassword: "Password"
	};

	$scope.constants = {
		MIN_PASS_LENGTH: 8
	};
	
	$scope.showLoginError = true;

	$scope.hasError = function(fieldName) {
		var field = $scope.loginForm[fieldName];
		return (field.$touched && field.$invalid);
	};

	$scope.isValid = function(fieldName) {
		var field = $scope.loginForm[fieldName];
		return field.$touched && field.$valid;
	};

	$scope.showHelpText = function(fieldName) {
		var field = $scope.loginForm[fieldName];
		return ($scope.loginForm.$submitted || field.$touched) && field.$invalid;
	};

	$scope.getHelpText = function(fieldName) {
		var helpText = "";
		if (fieldName == 'login')
			helpText = $scope.loginError;
		else {
			var field = $scope.loginForm[fieldName];
			if (field.$invalid) {
				if (field.$error.required)
					helpText = $scope.fieldNames[fieldName] + " is required.";
				else if (field.$error.email)
					helpText = "Please enter a valid email.";
				else if (field.$error.minlength)
					helpText = $scope.fieldNames[fieldName] + " should have atleast " + $scope.constants.MIN_PASS_LENGTH + " characters.";
			}
		}
		return helpText;
	};

	$scope.submit = function() {
		$scope.showLoginError = false;
		$scope.loginError = "";
		loginService.login($scope.user)
			.then(function(data) {
				$scope.user.access_token = data.access_token;
				userService.setCurrentUser($scope.user);
				eventService.publish('authorized');
				$state.go('feeds.home');
			}, function(data) {
				console.error(data.error);
				$scope.showLoginError = true;
				$scope.loginError = data.error;
			});
	};

	//redirect to stas page if a user is already logged in
	var currentUser = userService.getCurrentUser();
	if (currentUser) {
		$state.go("feeds.home");
	}

});