Fideligard.controller('TransactionCtrl', ['$scope', 'yqlService', 'userService', 'transactionService', function($scope, yqlService, userService, transactionService){

  $scope.quotes = yqlService.getStocks();
  $scope.date = userService.getDate();
  $scope.userData = userService.getUserData();

}]);