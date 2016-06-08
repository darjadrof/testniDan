(function(){
  'use strict';

  angular
    .module('App', [
      'ui.router',
      'Forms'
    ])
    .config(AppConfig)
    .run(App);

  AppConfig.$inject = ['$stateProvider', '$urlRouterProvider'];
  App.$inject = ['$rootScope', '$http', '$filter'];

  function AppConfig($stateProvider, $urlRouterProvider) {
    var homeState = {
      url: '/',
      templateUrl: 'app/home/home.view.html'
    };
    var incomeState = {
      url: '/',
      templateUrl: 'app/incomes/incomes.view.html'
    };
    var expenseState = {
      url: '/',
      templateUrl: 'app/expenses/expenses.view.html'
    };
    var addIncomeState = {
      url: '/',
      templateUrl: 'app/incomes/incomes-add.view.html'
    };
    var addExpenseState = {
      url: '/',
      templateUrl: 'app/expenses/expenses-add.view.html'
    };


    $stateProvider.state('overview', homeState);
    $stateProvider.state('expenses', expenseState);
    $stateProvider.state('incomes', incomeState);
    $stateProvider.state('addincome', addIncomeState);
    $stateProvider.state('addexpense', addExpenseState);

    $urlRouterProvider.otherwise('/');
  }

  function App($rootScope, $http, $filter) {
    var self = $rootScope;
    var rootUrl = "http://toshl-killer.herokuapp.com/api/v1/balance_changes";
    
    // This is the current time span that we are looking at. 
    $rootScope.selectedPeriod = new Date();
    
    // Gets the data for this time period.
    function getData(){
      $http.get(rootUrl+"?filter[period]="+$filter('date')($rootScope.selectedPeriod, "yyyy-MM")).then(function(response){
        self.list = response.data.data;
      });
    };
    getData();
    
    // Calculates all earnings.    
    function calculateEarnings(){
      var earnings = 0;
      
      if(!$rootScope.list)
        return earnings;
        
      for(var i=0; i<$rootScope.list.length; i++){
        if($rootScope.list[i].attributes.change_type=="income")
          earnings+=$rootScope.list[i].attributes.value;
      }
      return earnings;
    };
    
    // Calculates all expenses. 
    function calculateExpenses(){
      var expenses = 0;
      
      if(!$rootScope.list)
        return expenses;
        
      for(var i=0; i<$rootScope.list.length; i++){
        if($rootScope.list[i].attributes.change_type=="expense")
          expenses+=$rootScope.list[i].attributes.value;
      }
      return expenses;
    };
   
    function calculateSavings(){
      return $rootScope.calculateEarnings() - $rootScope.calculateExpenses();
    };
    
    function haveSavings(){
      return $rootScope.calculateSavings()>=0?true:false;
    };
    
    function haveNoSavings() {
      return $rootScope.calculateSavings()<0?true:false;
    }
    
    // Refreshes data to the previous period.
    function getDataPreviousPeriod(){
      $rootScope.selectedPeriod.setMonth($rootScope.selectedPeriod.getMonth( ) - 1 );
      $rootScope.getData();
    };
    
    // Refreshes data to the next period.
    function getDataNextPeriod(){
      $rootScope.selectedPeriod.setMonth($rootScope.selectedPeriod.getMonth( ) + 1 );
      $rootScope.getData();
    };
    
    // Removing an item.
    function removeItem(item){
      var url = rootUrl+"/"+item.id;
      
      $http.delete(url).then(function (response) {
        // Success    
         $rootScope.getData();
      }, function (response) {
        // Error
        alert("Failed to remove item!");
      });

    };
      
    
    // Adding functions to the scope.   
    $rootScope.calculateEarnings = calculateEarnings;
    $rootScope.calculateExpenses = calculateExpenses;
    $rootScope.calculateSavings = calculateSavings;
    $rootScope.haveSavings = haveSavings;
    $rootScope.haveNoSavings = haveNoSavings;
    $rootScope.getDataPreviousPeriod = getDataPreviousPeriod;
    $rootScope.getDataNextPeriod = getDataNextPeriod;
    $rootScope.getData = getData;
    $rootScope.removeItem = removeItem;
  }
})();
