app.directive("loader", function(eventService) {
	return {
		restrict: "E",
		templateUrl: 'templates/loader.html',
		scope: {},
		controller: function($scope) {
			$scope.showLoader = false;

			eventService.subscribe("loader.show", function() {
				//console.log("loder.show");
				$scope.showLoader = true;
			});

			eventService.subscribe("loader.hide", function() {
				//console.log("loader.hide");
				$scope.showLoader = false;
			});
		}
	};
});