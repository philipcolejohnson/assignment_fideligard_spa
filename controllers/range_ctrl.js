Fideligard.controller('RangeCtrl', ['$scope', 'yqlService', 'userService', function($scope, yqlService, userService){

  $scope.quotes = yqlService.getStocks();
  $scope.date = userService.getDate();
  $scope.date.index = 30; //Math.floor($scope.quotes / 2);
  $scope.max = $scope.quotes.length - 1;
  $scope.min = 30;

}]);