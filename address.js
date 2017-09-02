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
    
    // this moves to the single card view
    service.goToSingle = function(id) {
        $state.go('single', {target_id: id} );
    };
    
    return service;
    
});

app.controller('HomeController', function($scope, $state, addressService) {
    //controller for the home view. can toggle between views on page for tables and cards based on a couple rootscope varialbes. on a hard refresh this page acts like the home page.
    
    $scope.homeClick = function() {
        $scope.noHardRefresh = false;
        $scope.viewTable = false;
        $scope.viewCards = false;
    };
    
    $scope.tableClick = function() {
        $scope.viewTable = true;
        $scope.viewCards = false;
        $scope.noHardRefresh = true;
    };
    
    $scope.cardsClick = function() {
        $scope.viewCards = true;
        $scope.viewTable = false;
        $scope.noHardRefresh = true;
    };
    
    // retrieves the data JSON data and sets it to scope so that the html can display the info
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
    
    $scope.homeClick = function() {
        $state.go('home');
    };
    
    $scope.tableClick = function() {
        $rootScope.viewTable = true;
        $state.go('home');
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
    });
    
});


