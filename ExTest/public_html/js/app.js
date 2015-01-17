'use strict';

angular
        .module('surveyApp', [
//        'ngCookies',
//        'ngResource',
//        'ngSanitize',
            'ngRoute',
            'ui.bootstrap',
            'bsTable',
//            "srvFilters",
//            "srvResource"
//        'blueimp.fileupload',
//        'ui.sortable',
//        'mgo-angular-wizard'

        ])
        .config(function ($routeProvider) {
            $routeProvider
                    .when('/', {
                        templateUrl: 'parts/main.html',
                        controller: 'MainCtrl'
                    })
                    .when('/tests', {
                        templateUrl: 'parts/survey-list.html',
                        controller: 'ManagerSurveyListCtrl'
                    })
//                    .when("/questions/0", {
//                        redirectTo: "/tests"
//                    })
                    .when("/questions/:num", {
                        controller: "PassingSurveyListCtrl",
                        templateUrl: "parts/ask_view.html"
                    })
                    .otherwise({
                        redirectTo: '/'
                    });
        });
