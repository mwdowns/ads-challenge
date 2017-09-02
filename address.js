var app = angular.module('address', ['ui.router']);

app.config(function($stateProvider, $urlRouterProvider) {
    
    // The various states of the app
    $stateProvider
    // This is the basic viewing state. Takes an object as a stateparam
    .state({
        name: 'home',
        url: '/',
        templateUrl: 'home.html',
        params: {obj: null},
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
    
    // Factory for common functions we use in different controllers
    var service = {};
    
    // This particular function parses an XML file and turns it into JSON
    service.getInfo = function() {
        
        return $http.get('ab.xml', 
            { transformResponse: function(cnv) {
                var x2js = new X2JS();
                var aftCnv = x2js.xml_str2json(cnv);
                return aftCnv;
            }
        });

    };
    
    // The following services toggle swtiches for various views on the home page
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
    
    // This moves to the single card view takes single argument, id.
    service.goToSingle = function(id) {
        $state.go('single', {target_id: id} );
    };
    
    return service;
    
});

app.controller('HomeController', function($scope, $rootScope, $state, $stateParams, addressService) {
    // Controller for the home view. Can toggle between views on page for tables and cards based on a couple rootscope varialbes. On a hard refresh this page acts like the home page.
    
    $scope.homeClick = function() {
        addressService.homeClick();
    };
    
    $scope.tableClick = function() {
        addressService.tableClick();
    };
    
    $scope.cardsClick = function() {
        addressService.cardsClick();
    };
    
    // Here we're getting the data to populate the address book. It looks for the stateparam object. If it's null or the the value of obj isn't an array, it calls the service. Else, it uses the object passed.
    if ($stateParams.obj === null || Array.isArray($stateParams.obj) === false) {
        addressService.getInfo()
        .success(function(response) {
            $rootScope.contacts = response.AddressBook.Contact;
        });
    } else {
        console.log(Array.isArray($stateParams.obj));
        $rootScope.contacts = $stateParams.obj;
    }
    
    $scope.goToSingle = function(id) {
        addressService.goToSingle(id);
    };
    
});

app.controller('SingleController', function($scope, $rootScope, $state, $stateParams, addressService) {
    // Controller for single contact view. Will get the ID of the contact from the $stateParam and use that to bring up the contact.
    
    $scope.singleID = $stateParams.target_id;

    $scope.contacts = $rootScope.contacts;
    
    var findContact = function(contacts) {
        return contacts.CustomerID === $scope.singleID;
    };
    
    $scope.contact = $rootScope.contacts.find(findContact);
    
    $scope.homeClick = function() {
        addressService.homeClick();
        $state.go('home', {obj: $scope.contacts});
    };
    
    $scope.tableClick = function() {
        addressService.tableClick();
        $state.go('home', {obj: $scope.contacts});
    };
    
    $scope.cardsClick = function() {
        addressService.cardsClick();
        $state.go('home', {obj: $scope.contacts});
    };
    
    // Toggles the edit view on the page
    $scope.edit = function() {
        $scope.editing = true;
    };
    
    // Submits the changes, goes back to the home page
    $scope.editContact = function() {
        $state.go('home', {obj: $scope.contacts});  
    };
});


