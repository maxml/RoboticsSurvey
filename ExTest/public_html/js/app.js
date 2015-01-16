'use strict';

angular
    .module('surveyApp', [
//        'ngCookies',
//        'ngResource',
//        'ngSanitize',
        'ngRoute',
        'ui.bootstrap',
        'ngGrid',
//        'blueimp.fileupload',
//        'ui.sortable',
//        'mgo-angular-wizard'

    ])
    .config(function($routeProvider) {
        $routeProvider
            .when('/', {
                templateUrl: 'parts/main.html',
                controller: 'MainCtrl'
            })
            .when('/tests', {
                templateUrl: 'parts/survey-list.html',
                controller: 'ManagerSurveyListCtrl'
            })
//            .when('/response/:surveyId', {
//                templateUrl: 'views/response.html',
//                controller: 'ResponseCtrl'
//            })
            .otherwise({
                redirectTo: '/'
            });
    });
