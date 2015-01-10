'use strict';


// Declare app level module which depends on filters, and services
angular.module('Robotics', [
    'ngRoute',
    'route-segment',
    'view-segment',
    'routeStyles',
    'Robotics.services',
    'Robotics.controllers'
]).
        config(['$routeSegmentProvider', '$routeProvider', function ($routeSegmentProvider, $routeProvider) {

                // Configuring provider options

                $routeSegmentProvider.options.autoLoadTemplates = true;

                // Setting routes. This consists of two parts:
                // 1. `when` is similar to vanilla $route `when` but takes segment name instead of params hash
                // 2. traversing through segment tree to set it up

                $routeSegmentProvider.
                        when('/login', 'login').
                        when('/logout', 'logout').
                        when('/home', 'home').
                        when('/crud', 'crud').
                        when('/crud/guards', 'crud.guards').
                        when('/crud/clients', 'crud.clients').
                        when('/crud/circuits', 'crud.circuits').
                        when('/crud/circuitunits', 'crud.circuitunits').
                        when('/crud/circuitunits/:id', 'crud.circuitunits.item').

                        segment('login', {templateUrl: 'parts/login.html', controller: 'LoginCtrl'}).
                        segment('logout', {templateUrl: 'parts/logout.html', controller: 'LogoutCtrl'}).
                        segment('home', {templateUrl: 'parts/home.html', controller: 'HomeCtrl'}).
                        segment('crud', {templateUrl: 'parts/crud.html', controller: 'CRUDCtrl'}).
                        
                        within().
                        segment('guards', {templateUrl: 'partials/crud/guards.html', controller: 'GuardCtrl'}).
                        segment('clients', {templateUrl: 'partials/crud/clients.html', controller: 'ClientCtrl'}).
                        segment('circuits', {templateUrl: 'partials/crud/circuits.html', controller: 'CircuitCtrl'}).
                        segment('circuitunits', {templateUrl: 'partials/crud/circuitunits.html', controller: 'CircuitunitCtrl'})
                        
                        .within()
                        .segment('item', {
                            templateUrl: 'partials/crud/circuitunits.selected.html',
                            dependencies: ['id', 'selectedCircuit'],
                            controller: 'CircuitunitSelectedCtrl'})
                        .up()
                        .up();

                $routeProvider.otherwise({redirectTo: '/login'});
            }]);
