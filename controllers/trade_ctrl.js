Fideligard.controller('TradeCtrl', ['$scope', 'yqlService', 'stockService', 'userService', '$stateParams', function($scope, yqlService, stockService, userService, $stateParams){

  $scope.transaction = {
    stock: $stateParams.stock,
    quantity: 1,
    price: 0,
    type: "Buy"
  };

  $scope.quotes = yqlService.getStocks();
  $scope.date = userService.getDate();
  $scope.companies = userService.getCompanies();

  $scope.$watch('date.index', function(){
    updateStock();
  });

  var updateStock = function() {
    if (!$scope.transaction.stock) {
      $scope.transaction.stock = $scope.companies[0];
    }

    $scope.transaction.price = stockService.findLatestPrice($scope.transaction.stock, $scope.date.index);
  };

  updateStock();

}]);
