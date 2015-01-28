'use strict';

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
                    //alert('Success!');
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
        };

        $scope.existUser = function () {
            return Parse.User.current() !== null;
        };

        $scope.goInside = function () {
            $timeout(function () {
                $location.path("/home");
                $route.reload();
            }, 100);
        };

        $scope.name = function () {
            if (Parse.User.current())
                return Parse.User.current().get('username');
        };
        $scope.email = function () {
            if (Parse.User.current())
                return Parse.User.current().get('email');
        };
        $scope.emailVerified = function () {
            if (Parse.User.current())
                return Parse.User.current().get('emailVerified');
        };
        $scope.createdAt = function () {
            if (Parse.User.current())
                return Parse.User.current().createdAt;
        };
        $scope.points = function () {
            if (Parse.User.current())
                return Parse.User.current().get('point');
        };
        $scope.nick = function () {
            if ($scope.points()) {
                if ($scope.points() < 5) {
                    return 'Дрон';
                }
                if ($scope.points() < 10) {
                    return "Продвинутый киборг";
                }
                if ($scope.points() < 15) {
                    return "Терминатор";
                }
                return "Кибер-мозг";

            }
            return "Бот";
        };

    }]);

controllerModule.controller('LogoutCtrl', ['$route', '$location', '$timeout',
    'ParseService', function ($route, $location, $timeout, ParseService) {

        $timeout(function () {
            $location.path("/login");
            $route.reload();
        }, 1000);

    }]);

controllerModule.controller('HomeCtrl', ['$scope', '$route', '$location', '$translate', 'ParseService',
    function ($scope, $route, $location, $translate, ParseService) {
        $scope.parse = ParseService;
        $scope.changeLanguage = function (lang) {
            $translate.use(lang);
        };
    }]);
