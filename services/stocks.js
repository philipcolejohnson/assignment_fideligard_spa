Fideligard.factory('stockService', ['yqlService', 'userService', function(yqlService, userService){

  var stockService = {};
  var _quotes = yqlService.getStocks();
  var _date = userService.getDate();


  stockService.findLatestPrice = function(stock, index) {
    var price = -1;


    while (price < 0) {
      if (index < 0) { return 0; }

      if (_quotes[index].data[stock]) {
        price = _quotes[index].data[stock].Adj_Close;
      } else { 
        index--;
      }
    }

    return price;
  };

  stockService.calcPriceChange = function(stock, daysChange) {
    var targetDay = Number(_date.index) + daysChange;
    var currentPrice = stockService.findLatestPrice(stock, _date.index);
    var price = stockService.findLatestPrice(stock, targetDay);

    return price - currentPrice;
  };

  return stockService;

}]);