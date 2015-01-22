'use strict';

/* Controllers */

var controllerModule = angular.module('Robotics.controllers', [
    'Robotics.services', 'pascalprecht.translate']);//'ui.bootstrap',

controllerModule.controller('LoginCtrl', ['$scope', '$location', '$route', '$timeout', 'ParseService',
    function ($scope, $location, $route, $timeout, ParseService) {

        var Account = ParseService.Account;
        $scope.user = {
            'username': (Account.isLoggedIn()) ? Account.getCurrentUser()
                    .get('username') : '',
            'password': (Account.isLoggedIn()) ? Account.getCurrentUser()
                    .get('password') : ''
        };
        $scope.login = function (user) {
            console.log(user.username);
            console.log(user.password);
            Account.login(user.username, user.password, {
                success: function (user) {
                    alert('Success!');
                },
                error: function (user, error) {
                    alert(error.message);
                }
            });
        };
        $scope.register = function (user) {
            console.log(user.username);
            console.log(user.password);
            Account.register(user.login, user.email, user.password);
        };

        $scope.reset_password = function (user) {
            Account.reset(user.email);
        };

        $scope.logout = function () {
            ParseService.Account.logout();
//            $location.path("/login");
//            $route.reload();
        };

        $scope.existUser = function () {
            return Parse.User.current() !== null;
        };

        $scope.goInside = function () {
            $location.path("/home");
            $route.reload();
        };
        
        $scope.name = Parse.User.current().get('username');
        $scope.email = Parse.User.current().get('email');
        $scope.emailVerified = Parse.User.current().get('emailVerified');
        $scope.createdAt = Parse.User.current().createdAt;
        $scope.points = Parse.User.current().get('point');

    }]);

controllerModule.controller('LogoutCtrl', ['$route', '$location', '$timeout',
    'ParseService', function ($route, $location, $timeout, ParseService) {

        $timeout(function () {
            $location.path("/login");
            $route.reload();
        })

    }]);

controllerModule.controller('HomeCtrl', ['$scope', '$route', '$location', '$translate', 'ParseService',
    function ($scope, $route, $location, $translate, ParseService) {
        $scope.parse = ParseService;
//        $scope.logout = function () {
//            ParseService.Account.logout();
//            $location.path("/login");
//            $route.reload();
//        };
        $scope.changeLanguage = function (lang) {
            $translate.use(lang);
        };
    }]);

controllerModule.controller('MainCtrl', ['$scope', '$location', '$timeout', '$routeSegment', 'ParseService',
    function ($scope, $location, $timeout, $routeSegment, ParseService) {

        angular.isUndefinedOrNull = function (val) {
            return angular.isUndefined(val) || val === null;
        };
        $scope.ParseAccount = ParseService.Account;
        $scope.$routeSegment = $routeSegment;
        $scope.go = function (path) {
            $location.path(path);
        };
        // auto direct based on login status
        $scope.$on('routeSegmentChange', function () {
            if (!angular.isUndefinedOrNull($scope.$routeSegment)
                    && !angular
                    .isUndefinedOrNull($scope.$routeSegment.name)) {
                if (!$scope.$routeSegment.contains('login')
                        && !$scope.ParseAccount.isLoggedIn()) {
                    $scope.go('login');
                }
                if ($scope.$routeSegment.contains('login')
                        && $scope.ParseAccount.isLoggedIn()) {
                    $scope.go('home');
                }
            }
        });

        $scope.awesomeThings = [
            'HTML5 Boilerplate',
            'AngularJS',
            'Karma'
        ];
    }]);
