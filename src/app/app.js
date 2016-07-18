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

});