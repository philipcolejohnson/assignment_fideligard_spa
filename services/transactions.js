Fideligard.factory('transactionService', ['yqlService', 'userService', function(yqlService, userService){

  var transactionService = {};
  var _quotes = yqlService.getStocks();
  var _date = userService.getDate();
  var _balance = userService.getBalance();
  var _transactions = {};

  transactionService.verify = function(total) {
    var currentDate = new Date(_quotes[_date.index].date);
    var endDate = new Date(_date.end);
    endDate.setDate(endDate.getDate() + 1);

    while ( currentDate < endDate ) {
      var dateString = currentDate.toISOString().slice(0,10);
      
      if (_balance[dateString] - total < 0) {
        return false;
      }

      currentDate.setDate(currentDate.getDate() + 1);
    }

    return true;
  };

  transactionService.buy = function(transaction) {
    
  };

  return transactionService;

}]);