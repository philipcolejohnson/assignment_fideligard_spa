Fideligard.factory('transactionService', ['yqlService', 'userService', function(yqlService, userService){

  var transactionService = {};
  var _quotes = yqlService.getStocks();
  var _date = userService.getDate();
  var _userData = userService.getUserData();

  var _updatePortfolio = function(transaction) {
    var currentDate = new Date(_quotes[_date.index].date);
    var endDate = new Date(_date.end);
    endDate.setDate(endDate.getDate() + 1);

    while ( currentDate < endDate ) {
      var dateString = currentDate.toISOString().slice(0,10);
      
      if (transaction.type === "Buy") {
        _userData.portfolio[dateString][transaction.stock] += transaction.quantity;
      } else {
        _userData.portfolio[dateString][transaction.stock] -= transaction.quantity;
      }

      currentDate.setDate(currentDate.getDate() + 1);
    }
    console.log(_userData.portfolio)

    return true;
  };

  transactionService.verify = function(transaction) {
    var currentDate = new Date(_quotes[_date.index].date);
    var endDate = new Date(_date.end);
    endDate.setDate(endDate.getDate() + 1);

    if (transaction.quantity === 0) { return false; }

    while ( currentDate < endDate ) {
      var dateString = currentDate.toISOString().slice(0,10);
      
      if (_userData.balance[dateString] - transaction.total < 0) {
        return false;
      }

      if (transaction.type === "Sell" && _userData.portfolio[dateString][transaction.stock] - transaction.quantity < 0) {
        return false;
      }

      currentDate.setDate(currentDate.getDate() + 1);
    }

    return true;
  };

  transactionService.addTransaction = function(transaction) {
    if (transaction.valid) {
      // create date entry if necessary
      if (!_userData.transactions[ _quotes[_date.index].date ]) {
        _userData.transactions[ _quotes[_date.index].date ] = {};
        _userData.transactions[ _quotes[_date.index].date ][transaction.stock] = {};
      }

      // enter/change transaction
      var dateData = _userData.transactions[ _quotes[_date.index].date ];
      dateData[transaction.stock][transaction.type] = {
        price: transaction.price,
        total: transaction.total,
        quantity: transaction.quantity
      };

      _updatePortfolio(transaction);
    }

    console.log(_userData.transactions);
  };

  return transactionService;

}]);