Fideligard.controller('TransactionCtrl', ['$scope', 'yqlService', 'userService', function($scope, yqlService, userService){

  $scope.quotes = yqlService.getStocks();
  $scope.date = userService.getDate();

}]);