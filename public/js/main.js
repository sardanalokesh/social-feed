var app = angular.module("EdgeForPublishers", ["ui.router", "angular-storage"]);

app.config(function($stateProvider, $urlRouterProvider, $httpProvider) {

	$stateProvider
		
		.state('login', {
			url: '/login',
			templateUrl: 'templates/login.html',
			controller: 'LoginCtrl'
		})

		.state('feeds', {
			url: '/feeds',
			abstract: true,
			templateUrl: 'templates/feeds.html'
		})

		.state('feeds.home', {
			url: '/home',
			templateUrl: 'templates/feeds-home.html',
			controller: 'FeedsHomeCtrl'
		})

		.state('feeds.profile', {
			url: '/profile',
			templateUrl: 'templates/feeds-profile.html',
			controller: 'FeedsProfileCtrl'
		});

		$urlRouterProvider.otherwise('/login');
		$httpProvider.interceptors.push('authInterceptor');

});;app.value("constants", {
	FEEDS_URL: "/user/feed?",
	SUBMIT_POST_URL: "/create/post",
	USER_INFO_URL: "/user/info?",
	SUBSCRIBE_URL: "/user/subscribe?",
	UNSUBSCRIBE_URL: "/user/unsubscribe?",
	TOPICS_LIST: "/topics/list",
	LIKE_URL: "/post/like?",
	UNLIKE_URL: "/post/unlike?",
	FILE_UPLOAD_URL: "/fileupload",
	FILE_URL_PREFIX: "/file/get?",
	LOGIN_PATH: "/loginSubmission",
	LOGOUT_PATH: "/logout"

});;app.controller("FeedsHomeCtrl", function($scope, $interval, util, constants, userService, topicService, fileUploader) {
	var currentUser = userService.getCurrentUser();
	
	userService.getUserDetails(function(data) {
		$scope.currentUserDetails = data;
	});

	topicService.getAllTopics(function(data) {
		$scope.allTopics = data;
		startPolling();
	});

	newPostReset();
	fetchFeedData();

	$scope.submitPost = function(post) {
		newPostReset();
		post.author = $scope.currentUserDetails.name;
		if (post.content && post.author) {
			post.likingUsers = [];
			$scope.feedCards.unshift(post);
			util.ajaxPost(constants.SUBMIT_POST_URL, post, true)
			.then(function(id) {
				$scope.feedCards[0].id = id;
			});
		}
		//post.likes = 0;
		//post.timeStamp = "Just now";
	};

	$scope.toggleLike = function(post) {
		if (alreadyLiked(post))
			unlikePost(post);
		else
			likePost(post);

	};

	$scope.alreadyLiked = alreadyLiked;
	$scope.getLikingUsers = getLikingUsers;
	$scope.uploadFile = uploadFile;
	$scope.getImageUrl = getImageUrl;

	function startPolling() {
		$interval(function() {
			fetchFeedData();
		},4000);
	}

	function fetchFeedData() {
		var url = constants.FEEDS_URL + "userName="+currentUser.username;
		util.ajaxGet(url, true).then(function(data) {
			data.map(function(d) {
				d.timeStamp = new moment(d.timeStamp).fromNow();
			});
			$scope.feedCards = data;
		});
	}

	function alreadyLiked(post) {
		return $scope.currentUserDetails && (post.likingUsers.indexOf($scope.currentUserDetails.name) > -1);
	}

	function likePost(post) {
		post.likes++;
		post.likingUsers.unshift($scope.currentUserDetails.name);
		var url = constants.LIKE_URL + "postId=" + post.id + "&userName=" + $scope.currentUserDetails.userName;
		util.ajaxGet(url, true).then(function(data) {
			post.likingUsers = data;
		});
	}

	function unlikePost(post) {
		post.likes--;
		var index = post.likingUsers.indexOf($scope.currentUserDetails.name);
		if (index > -1)
			post.likingUsers.splice(index, 1);
		var url = constants.UNLIKE_URL + "postId=" + post.id + "&userName=" + $scope.currentUserDetails.userName;
		util.ajaxGet(url, true).then(function(data) {
			post.likingUsers = data;
		});
	}

	function newPostReset() {
		$scope.newPost = {
			topic: "Exponential"
		};
	}

	function getLikingUsers(post) {
		var p = angular.copy(post);
		return p.likingUsers.toString();
	}

	function uploadFile() {
		var file = $scope.attachmentImage;
		var uploadUrl = constants.FILE_UPLOAD_URL;
		fileUploader.upload(file, uploadUrl, function(id) {
			$scope.newPost.attachmentId = id;
			angular.element('#imageUploadModal').modal('hide');
		});
	}

	function getImageUrl(attachmentId) {
		return constants.FILE_URL_PREFIX + "id=" + attachmentId;
	}
	
});;app.controller("FeedsProfileCtrl", function($scope, userService, topicService, util, constants) {
	var currentUser = userService.getCurrentUser();

	userService.getUserDetails(function(data) {
		$scope.currentUserDetails = data;
		$scope.userTopics = $scope.currentUserDetails.subscribedTopics;
	});

	topicService.getAllTopics(function(data) {
		$scope.allTopics = data;
	});

	$scope.unfollowTopic = function(topic) {
		var index = $scope.userTopics.indexOf(topic);
		if (index > -1) {
			$scope.userTopics.splice(index, 1);
			unfollowTopic(topic);
		}
	};

	$scope.toggleTopicFollow = function(topic) {
		if (isTopicAlreadySubscribed(topic)) {
			removeTopicFromList(topic);
			unfollowTopic(topic);
		}
		else {
			addTopicToList(topic);
			followTopic(topic);
		}
	};

	$scope.getFollowButtonText = function(topic) {
		if (isTopicAlreadySubscribed(topic))
			return "Unfollow";
		return "Follow";
	};

	$scope.getDisplayImageUrl = getDisplayImageUrl;

	function isTopicAlreadySubscribed(topic) {
		return $scope.userTopics.indexOf(topic) > -1;
	}

	function unfollowTopic(topic) {
		var url = constants.UNSUBSCRIBE_URL + "userName=" + currentUser.username + "&topic=" + topic;
		util.ajaxGet(url, true).then(function(data) {
			console.log("topic successfully unsubscribed - " +data);
		});
	}

	function followTopic(topic) {
		var url = constants.SUBSCRIBE_URL + "userName=" + currentUser.username + "&topic=" + topic;
		util.ajaxGet(url, true).then(function(data) {
			console.log("topic successfully subscribed - " +data);
		});
	}

	function removeTopicFromList(topic) {
		var index = $scope.userTopics.indexOf(topic);
		if (index > -1)
			$scope.userTopics.splice(index, 1);
	}

	function addTopicToList(topic) {
		$scope.userTopics.push(topic);
	}

	function getDisplayImageUrl() {
		var id = 11;
		if ($scope.currentUserDetails && $scope.currentUserDetails.avatarId)
			id = $scope.currentUserDetails.avatarId;
		return constants.FILE_URL_PREFIX + "id=" + id;
	}
});;app.controller("LoginCtrl", function($scope, $location, $state, util, constants, loginService, userService, eventService) {

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

});;app.directive('fileModel', ['$parse', function ($parse) {
    return {
        restrict: 'A',
        link: function(scope, element, attrs) {
            var model = $parse(attrs.fileModel);
            var modelSetter = model.assign;
            
            element.bind('change', function(){
                scope.$apply(function(){
                    modelSetter(scope, element[0].files[0]);
                });
            });
        }
    };
}]);;app.directive("loader", function(eventService) {
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
});;app.directive("navBar", function($state, eventService, userService, loginService) {
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
});;app.directive('tooltip', function(){
    return {
        restrict: 'A',
        link: function(scope, element, attrs){
            $(element).hover(function(){
                // on mouseenter
                $(element).tooltip('show');
            }, function(){
                // on mouseleave
                $(element).tooltip('hide');
            });
        }
    };
});;app.service('authInterceptor', function($q, $rootScope, eventService, constants, store) {
	
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
});;app.service("eventService", function($rootScope) {
	
	this.publish = function(name, data) {
		$rootScope.$emit(name, data);
	};

	this.subscribe = function(name, listener) {
		$rootScope.$on(name, listener);
	};
});;app.service('fileUploader', function ($http, eventService) {
    this.upload = function(file, uploadUrl, callback){
    	//eventService.publish("loader.show");
        var fd = new FormData();
        fd.append('file', file);
        $http.post(uploadUrl, fd, {
            transformRequest: angular.identity,
            headers: {'Content-Type': undefined}
        })
        .success(function(data){
        	callback(data);
        	//eventService.publish("loader.hide");
        })
        .error(function(){
        	//eventService.publish("loader.hide");
        });
    };
});;app.service("loginService", function(util, constants) {

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
	
});;app.service("topicService", function(util, constants) {

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
});;app.service("userService", function(store, constants, util) {
	
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
});;app.factory("util", function(eventService, $http, $q) {
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