var app = angular.module('address', ['ui.router']);

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

app.factory('addressService', function( $rootScope, $state, $http) {
    
    var service = {};
    
    service.getInfo = function() {
        
        return $http.get('ab.xml', 
            { transformResponse: function(cnv) {
                var x2js = new X2JS();
                var aftCnv = x2js.xml_str2json(cnv);
                return aftCnv;
            }
        });

    };
    
    service.goHome = function() {
        $state.go('home');
    };
    
    service.goToTable = function() {
        $state.go('table');
    };
    
    service.goToCards = function() {
        $state.go('cards');
    };
    
    service.goToSingle = function(id) {
        $state.go('single', {target_id: id} );
    };
    
    return service;
    
});

app.controller('MainController', function($scope, $rootScope, $http, $state, addressService) {
    
    console.log('in main controller');
    
});

app.controller('HomeController', function($scope, $rootScope, $state, addressService) {
    
    console.log('in home controller');
    
    $scope.tableClick = function() {
        console.log('clicked table button');
        addressService.goToTable();
    };
    
    $scope.cardsClick = function() {
        console.log('clicked cards button');
        addressService.goToCards();
    };
    
});

app.controller('TableController', function($scope, $rootScope, $state, addressService) {
    
    $scope.homeClick = function() {
        console.log('clicked home button');
        addressService.goHome();
    };
    
    $scope.cardsClick = function() {
        console.log('clicked cards button');
        addressService.goToCards();
    };
    
    console.log('in table controller');
    addressService.getInfo()
    .success(function(response) {
        $scope.contacts = response.AddressBook.Contact;
        console.log($scope.contacts);
    });
    
    $scope.goToSingle = function(id) {
        addressService.goToSingle(id);
    };
});

app.controller('CardsController', function($scope, $rootScope, $state, addressService) {
    console.log('in cards controller');
    $scope.homeClick = function() {
        console.log('clicked home button');
        addressService.goHome();
    };
    
    $scope.tableClick = function() {
        console.log('clicked table button');
        addressService.goToTable();
    };
    
    addressService.getInfo()
    .success(function(response) {
        $scope.contacts = response.AddressBook.Contact;
        console.log($scope.contacts);
    });
    
    $scope.goToSingle = function(id) {
        addressService.goToSingle(id);
    };
    
});

app.controller('SingleController', function($scope, $rootScope, $state, $stateParams, addressService) {
    $scope.singleID = $stateParams.target_id;
    console.log('in single controller and this is the id: ', $scope.singleID);
    
    $scope.homeClick = function() {
        console.log('clicked home button');
        addressService.goHome();
    };
    
    $scope.tableClick = function() {
        console.log('clicked table button');
        addressService.goToTable();
    };
    
    $scope.cardsClick = function() {
        console.log('clicked cards button');
        addressService.goToCards();
    };
    
    var findContact = function(contacts) {
        return contacts.CustomerID === $scope.singleID;
    };
    
    addressService.getInfo()
    .success(function(response) {
        $scope.contact = response.AddressBook.Contact.find(findContact);
        console.log($scope.contact);
    });
    
});


