app.controller("FeedsProfileCtrl", function($scope, userService, topicService, util, constants) {
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
});