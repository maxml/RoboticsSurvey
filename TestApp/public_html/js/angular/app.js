'use strict';


// Declare app level module which depends on filters, and services
angular.module('Robotics', [
    'ngRoute',
    'route-segment',
    'view-segment',
    'routeStyles',
    'Robotics.services',
    'Robotics.controllers',
    'ui.bootstrap',
    'bsTable'
]).
        config(['$routeProvider', function ($routeProvider) {

                // Configuring provider options

//                $routeSegmentProvider.options.autoLoadTemplates = true;

                // Setting routes. This consists of two parts:
                // 1. `when` is similar to vanilla $route `when` but takes segment name instead of params hash
                // 2. traversing through segment tree to set it up

//                $routeSegmentProvider.
//                        when('/login', 'login').
//                        when('/logout', 'logout').
//                        when('/home', 'home').
//                        segment('login', {templateUrl: 'parts/login.html', controller: 'LoginCtrl'}).
//                        segment('logout', {templateUrl: 'parts/logout.html', controller: 'LogoutCtrl'}).
//                        segment('home', {templateUrl: 'parts/main.html', controller: 'MainCtrl'});

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
                            controller: 'MainCtrl'
                        })
                        .when('/tests', {
                            templateUrl: 'parts/survey-list.html',
                            controller: 'ManagerSurveyListCtrl'
                        })
                        .when("/questions/:num", {
                            controller: "PassingSurveyListCtrl",
                            templateUrl: "parts/ask_view.html"
                        })
                        .when("/result", {
                            controller: "ResultSurveyCtrl",
                            templateUrl: "parts/result.html"
                        });

                $routeProvider.otherwise({redirectTo: '/login'});
            }]);
