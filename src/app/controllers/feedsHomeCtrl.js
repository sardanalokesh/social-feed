app.controller("FeedsHomeCtrl", function($scope, $interval, util, constants, userService, topicService, fileUploader) {
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
	
});