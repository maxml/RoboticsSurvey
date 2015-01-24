'use strict';


// Declare app level module which depends on filters, and services
angular.module('Robotics', [
    'ngRoute',
    'ngAnimate',
    'ngTouch',
//    'route-segment',
//    'view-segment',
//    'routeStyles',
    'Robotics.services',
    'Robotics.controllers',
    'ui.bootstrap',
    'bsTable'
]).
        config(['$routeProvider', function ($routeProvider) {

                $routeProvider
                        .when('/login', {
                            templateUrl: 'parts/login.html',
                            controller: 'LoginCtrl'
                        })
                        .when('/logout', {
                            templateUrl: 'parts/logout.html',
                            controller: 'LogoutCtrl'
                        })
                        .when('/home', {
                            templateUrl: 'parts/main.html',
                            controller: 'MaterialCtrl'
                        })
                        .when('/tests', {
                            templateUrl: 'parts/restricted/survey-list.html',
                            controller: 'ManagerSurveyListCtrl'
                        })
                        .when("/questions/:num", {
                            controller: "PassingSurveyListCtrl",
                            templateUrl: "parts/restricted/ask_view.html"
                        })
                        .when("/result", {
                            controller: "ResultSurveyCtrl",
                            templateUrl: "parts/restricted/result.html"
                        })
                        .when("/images", {
                            controller: "ImagesCtrl",
                            templateUrl: "parts/restricted/images.html"
                        })
                        .when("/videos", {
                            controller: "VideosCtrl",
                            templateUrl: "parts/restricted/videos.html"
                        })
                        .when("/articles", {
                            controller: "ArticlesCtrl",
                            templateUrl: "parts/restricted/articles.html"
                        })

                        .otherwise({redirectTo: '/login'});
            }]);
