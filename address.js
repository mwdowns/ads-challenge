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
    
    service.homeClick = function() {
        $rootScope.noHardRefresh = false;
        $rootScope.viewTable = false;
        $rootScope.viewCards = false;
    };
    
    service.tableClick = function() {
        $rootScope.viewTable = true;
        $rootScope.viewCards = false;
        $rootScope.noHardRefresh = true;
    };
    
    service.cardsClick = function() {
        $rootScope.viewCards = true;
        $rootScope.viewTable = false;
        $rootScope.noHardRefresh = true;
    };
    
    // this moves to the single card view
    service.goToSingle = function(id) {
        $state.go('single', {target_id: id} );
    };
    
    return service;
    
});

app.controller('HomeController', function($scope, $rootScope, $state, addressService) {
    //controller for the home view. can toggle between views on page for tables and cards based on a couple rootscope varialbes. on a hard refresh this page acts like the home page.
    
    $scope.homeClick = function() {
        // $rootScope.noHardRefresh = false;
        // $rootScope.viewTable = false;
        // $rootScope.viewCards = false;
        addressService.homeClick();
    };
    
    $scope.tableClick = function() {
        // $rootScope.viewTable = true;
        // $rootScope.viewCards = false;
        // $rootScope.noHardRefresh = true;
        console.log($rootScope.contacts);
        addressService.tableClick();
    };
    
    $scope.cardsClick = function() {
        // $rootScope.viewCards = true;
        // $rootScope.viewTable = false;
        // $rootScope.noHardRefresh = true;
        addressService.cardsClick();
    };
    
    // retrieves the data JSON data and sets it to scope so that the html can display the info
    addressService.getInfo()
    .success(function(response) {
        $rootScope.contacts = response.AddressBook.Contact;
    });
    
    $scope.goToSingle = function(id) {
        addressService.goToSingle(id);
    };
    
});

app.controller('SingleController', function($scope, $rootScope, $state, $stateParams, addressService) {
    $scope.singleID = $stateParams.target_id;

    $scope.contacts = $rootScope.contacts;
    
    var findContact = function(contacts) {
        return contacts.CustomerID === $scope.singleID;
    };
    
    $scope.contact = $rootScope.contacts.find(findContact);
    
    $scope.homeClick = function() {
        addressService.homeClick();
        $state.go('home');
    };
    
    $scope.tableClick = function() {
        addressService.tableClick();
        $state.go('home');
    };
    
    $scope.cardsClick = function() {
        addressService.cardsClick();
        $state.go('home');
    };
    
    // addressService.getInfo()
    // .success(function(response) {
    //     $scope.contact = response.AddressBook.Contact.find(findContact);
    // });
    
    $scope.edit = function() {
        console.log($scope.contact);
        console.log($rootScope.contacts);
        $scope.editing = true;
    };
    
});


