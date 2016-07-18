app.service("eventService", function($rootScope) {
	
	this.publish = function(name, data) {
		$rootScope.$emit(name, data);
	};

	this.subscribe = function(name, listener) {
		$rootScope.$on(name, listener);
	};
});