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
    .controller("CrudFormController", ["$scope", "$http", "$filter", "$location", function($scope, $http, $filter, $location){
      // Setting the default data for creating new items.
      $scope.crudData = {
        "dayOfMonth": parseInt($filter('date')(new Date(), "dd")),
        "type": null,
        "value": 0
      };

      // Adding new items.
      function createItem(item){
        var resultItem = {
          "data": {
            "attributes": {
              "value": item.value,
              "change_type": item.type,
              "entry_date": $filter('date')($scope.selectedPeriod, "yyyy-MM")+"-"+convertToTwoDigits(item.dayOfMonth)
            }
          }
        };
        
        $http({
            url: 'http://toshl-killer.herokuapp.com/api/v1/balance_changes',
            method: "POST",
            data: resultItem
        })
        .then(function(response) {
          // success
          $location.path("overview");   
        }, 
        function(response) { // optional
          // failed
          alert("Failed to save data!");
        });
      };
      
      // Adding functions to scope.
      $scope.createItem = createItem;
    }]);
    
    function convertToTwoDigits(number){
       return (number.toString().length < 2) ? "0"+number : number;
    }
})();