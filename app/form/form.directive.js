(function(){
  'use strict';

  angular
    .module('Forms', [])
    .directive('crudForm', function() {
      return {
        restrict: "E",
        templateUrl: 'app/form/form.template.html',
        controller: "CrudFormController"
      };
    })
    .controller("CrudFormController", ["$scope", "$http", "$filter", function($scope, $http, $filter){
       
      // Setting the default day to today.
      $scope.dayOfMonth = parseInt($filter('date')(new Date(), "dd"));
      
      // The date attribute will automatically update. 
      function updateEntryDate(){
        return $filter('date')(new Date(), "yyyy-MM")+"-"+$scope.dayOfMonth;
      };
      $scope.updateEntryDate = updateEntryDate;
      
      // The result will be saved here.
      $scope.newItem = {
        "data": {
          "attributes": {
            "value": 10,
            "change_type": "income",
            "entry_date": $scope.updateEntryDate()
          }
        }
      };
     
      function createItem(item){
        console.log(item);
        /*$http({
            url: 'http://toshl-killer.herokuapp.com/api/v1/balance_changes',
            method: "POST",
            data: $scope.newItem
        })
        .then(function(response) {
          console.log(response);
                // success
        }, 
        function(response) { // optional
                // failed
                console.log(response);
        });*/
      };
      
      $scope.createItem = createItem;
      
    }]);
})();