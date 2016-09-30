Fideligard.controller('StocksCtrl', ['$scope', 'yqlService', 'stockService', 'userService', function($scope, yqlService, stockService, userService){

  $scope.quotes = yqlService.getStocks();
  $scope.date = userService.getDate();
  $scope.companies = userService.getCompanies();
  $scope.listings = [];

  $scope.$watch('date.index', function(){
    updateListings();
  });

  var updateListings = function() {
    $scope.listings = [];
    $scope.companies.forEach(function(stock) {
      $scope.listings.push( setStockListings(stock) );
    });
  };

  var setStockListings = function (stock) {
    var prices = {};

    prices.symbol = stock;
    prices.current = stockService.findLatestPrice(stock, $scope.date.index);
    prices.one = stockService.calcPriceChange(stock, -1);
    prices.seven = stockService.calcPriceChange(stock, -7);
    prices.thirty = stockService.calcPriceChange(stock, -30);
    return prices;
  };

  updateListings();

}]);