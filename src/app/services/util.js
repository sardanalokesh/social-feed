app.factory("util", function(eventService, $http, $q) {
	return {
		ajaxPost: function(url, data, noLoader) {
			if (!noLoader)
				eventService.publish("loader.show");
			var deferred = $q.defer();
			$http({
			    method: 'POST',
			    url: url,
			    data: data,
			    headers: {
			        'Content-Type': 'application/json; charset=utf-8'
			    }
			}).then(function(response) {
				if (!noLoader)
					eventService.publish("loader.hide");
				if (response.status == 200)
			  		deferred.resolve(response.data);
			  	else
			  		deferred.reject(response.data);
			}, function(response) {
				if (!noLoader)
					eventService.publish("loader.hide");
			  	deferred.reject(response.data);
			});
			return deferred.promise;
		},
		ajaxGet: function(url, noLoader) {
			if (!noLoader)
				eventService.publish("loader.show");
			var deferred = $q.defer();
			$http({
			    method: 'GET',
			    url: url,
			    headers: {
			        'Content-Type': 'application/json; charset=utf-8'
			    }
			}).then(function(response) {
				if (!noLoader)
					eventService.publish("loader.hide");
				if (response.status == 200)
			  		deferred.resolve(response.data);
			  	else
			  		deferred.reject(response.data);
			}, function(response) {
				if (!noLoader)
					eventService.publish("loader.hide");
			  	deferred.reject(response.data);
			});
			return deferred.promise;
		},
		getIterator: function(array, pageSize) {
			var startIndex = 0;
			var endIndex = pageSize;
			var pageNumber = 1;
			return {

				get: function() {
					return array.slice(startIndex, endIndex);
				},

				next: function() {
					if (startIndex < array.length) {
						startIndex +=  pageSize;
						endIndex = startIndex + pageSize;
						pageNumber++;
						return startIndex;
					}
					return false;
				},

				previous: function() {
					if (endIndex > 0) {
						endIndex -=  pageSize;
						startIndex = endIndex - pageSize;
						pageNumber--;
						return startIndex;
					}
					return false;
				},

				hasNext: function() {
					return (endIndex < array.length);
				},

				hasPrevious: function() {
					return (startIndex > 0);
				},

				getTotalPages: function() {
					return Math.ceil(array.length/pageSize);
				},

				getCurrentPage: function() {
					return pageNumber;
				}
			};
		},
	};
});