var app = angular.module('address', ['ui.router']);

app.config(function($stateProvider, $urlRouterProvider) {
    
    // The various states of the app
    $stateProvider
    .state({
        name: 'home',
        url: '/',
        templateUrl: 'home.html',
        controller: 'HomeController'
    })
    .state({
        name: 'group',
        url: '/group',
        templateUrl: 'group.html',
        controller: 'GroupController'
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
    
    // factory for common functions we use in different controllers
    var service = {};
    
    // this particular function parses an XML file and turns it into JSON
    service.getInfo = function() {
        
        return $http.get('ab.xml', 
            { transformResponse: function(cnv) {
                var x2js = new X2JS();
                var aftCnv = x2js.xml_str2json(cnv);
                return aftCnv;
            }
        });

    };
    
    // the following are for buttons that move from state to state
    service.goHome = function() {
        // $rootScope.viewHome = true;
        $rootScope.viewTable = $rootScope.viewCards = false;
        $state.go('home');
    };
    
    service.goToGroup = function() {
        $state.go('group');
    };
    
    service.goToSingle = function(id) {
        $state.go('single', {target_id: id} );
    };
    
    return service;
    
});

app.controller('HomeController', function($scope, $rootScope, $state, addressService) {
    
    //controller for the home page...nothing fancy just some buttons...can probably get rid of this at some point
    $scope.tableClick = function() {
        $rootScope.viewTable = true;
        $rootScope.noHardRefresh = true;
        addressService.goToGroup();
    };
    
    $scope.cardsClick = function() {
        $rootScope.viewCards = true;
        $rootScope.noHardRefresh = true;
        addressService.goToGroup();
    };
    
});

app.controller('GroupController', function($scope, $rootScope, $state, addressService) {
    //controller for the group view
    
    $scope.homeClick = function() {
        addressService.goHome();
    };
    
    $scope.tableClick = function() {
        $rootScope.viewTable = true;
        $rootScope.viewCards = false;
        $rootScope.noHardRefresh = true;
    };
    
    $scope.cardsClick = function() {
        $rootScope.viewCards = true;
        $rootScope.viewTable = false;
        $rootScope.noHardRefresh = true;
    };
    
    console.log($scope.noHardRefresh);
    
    addressService.getInfo()
    .success(function(response) {
        $scope.contacts = response.AddressBook.Contact;
    });
    
    $scope.goToSingle = function(id) {
        addressService.goToSingle(id);
    };
    
});

app.controller('SingleController', function($scope, $rootScope, $state, $stateParams, addressService) {
    $scope.singleID = $stateParams.target_id;
    console.log('in single controller and this is the id: ', $scope.singleID);
    
    $scope.homeClick = function() {
        addressService.goHome();
    };
    
    $scope.tableClick = function() {
        $rootScope.viewTable = true;
        addressService.goToGroup();
    };
    
    $scope.cardsClick = function() {
        $rootScope.viewCards = true;
        addressService.goToGroup();
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


