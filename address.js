var app = angular.module('address', ['ui-router']);

app.config(function($stateProvider, $urlRouterProvider) {
    
    $stateProvider
    .state({
        name: 'home',
        url: '/',
        templateUrl: 'home.html',
        controller: 'HomeController'
    })
    .state({
        name: 'table',
        url: '/table',
        templateUrl: 'table.html',
        controller: 'TableController'
    })
    .state({
        name: 'cards',
        url: '/cards',
        templateUrl: 'cards.html',
        controller: 'CardsController'
    })
    .state({
        name: 'single',
        url: '/single/{target_id}',
        templateUrl: 'single.html',
        controller: 'SingleController'
    });
    
    $urlRouterProvider.otherwise('/');
    
});