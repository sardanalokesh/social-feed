app.directive("navBar", function($state, eventService, userService, loginService) {
	return {
		restrict: "E",
		templateUrl: 'templates/navbar.html',
		scope: {
			user: '='
		},
		controller: function($scope) {
			eventService.subscribe('authorized', function() {
				$scope.currentUser = userService.getCurrentUser();
			});

			eventService.subscribe('unauthorized', function() {
				$scope.currentUser = userService.setCurrentUser(null);
			});

			$scope.logout = function() {
				loginService.logout($scope.currentUser)
				.then(function(response) {
					$scope.currentUser = userService.setCurrentUser(null);
					$state.go('login');
					}, function(error) {
					console.log(error);
				});
			};

			$scope.currentUser = userService.getCurrentUser();

			$scope.$watch("currentUser", function() {
				if (!$scope.currentUser)
					$state.go('login');
			});

			userService.getUserDetails(function(data) {
				$scope.currentUserDetails = data;
			});

			$scope.notifications = [{
				text: "Prashant and Avinash liked your post.",
				read: false
			}, {
				text: "A new post in Engineering by Vipul.",
				read: false
			}, {
				text: "A new post in Finance by Dilip.",
				read: true
			}];

			$scope.totalUnreadNotifications = 2;
		}
	};
});