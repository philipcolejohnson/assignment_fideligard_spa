Fideligard.controller('TransactionCtrl', ['$scope', 'yqlService', 'userService', 'transactionService', function($scope, yqlService, userService, transactionService){

  $scope.quotes = yqlService.getStocks();
  $scope.date = userService.getDate();
  $scope.userData = userService.getUserData();

  $scope.transFilter  = {
    type: "date",
    rev: false
  };

  $scope.toggleFilter = function(filter) {
    if ($scope.transFilter.type === filter) {
      $scope.transFilter.rev = !$scope.transFilter.rev;
    } else {
      $scope.transFilter.type = filter;
      $scope.transFilter.rev = false;
    }
  };

}]);