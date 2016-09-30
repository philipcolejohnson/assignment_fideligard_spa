Fideligard.factory('stockService', ['yqlService', 'userService', function(yqlService, userService){

  var stockService = {};
  var _quotes = yqlService.getStocks();
  var _date = userService.getDate();


  var findLatestPrice = function(stock, index) {
    var price = -1;

    while (price < 0) {
      if (_quotes[index].data[stock].Adj_Close) {
        price = _quotes[index].data[stock].Adj_Close;
      } else { 
        index--;
      }
    }

    return price;
  };

  stockService.calcPriceChange = function(stock, daysChange) {
    var targetDay = _date.index + daysChange;
    var currentPrice = findLatestPrice(stock, _date.index);
    var price = findLatestPrice(stock, targetDay);

    return price - currentPrice;
  };

  return stockService;

}]);