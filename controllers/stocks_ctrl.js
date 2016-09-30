Fideligard.controller('StocksCtrl', ['$scope', 'yqlService', 'stockService', 'userService', function($scope, yqlService, stockService, userService){

  $scope.quotes = yqlService.getStocks();
  $scope.date = userService.getDate();

  $scope.$watch($scope.date, function(){
    stockService.calcPriceChange(stock, -1);
    stockService.calcPriceChange(stock, -7);
    stockService.calcPriceChange(stock, -30);
  });

}]);