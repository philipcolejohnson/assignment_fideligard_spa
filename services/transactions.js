Fideligard.factory('transactionService', ['yqlService', 'userService', function(yqlService, userService){

  var transactionService = {};
  var _quotes = yqlService.getStocks();
  var _date = userService.getDate();
  var _userData = userService.getUserData();

  var _updateData = function(transaction) {
    var currentDate = new Date(transaction.date);
    currentDate.setHours( currentDate.getHours() + 12 );
    var endDate = new Date(_date.end);
    endDate.setDate(endDate.getDate() + 1);

    while ( currentDate < endDate ) {
      var dateString = currentDate.toISOString().slice(0,10);

      if (transaction.type === "Buy") {
        _userData.portfolio[dateString][transaction.stock] += transaction.quantity;
        _userData.balance[dateString] -= transaction.total;
      } else {
        _userData.portfolio[dateString][transaction.stock] -= transaction.quantity;
        _userData.balance[dateString] += transaction.total;
      }

      currentDate.setDate(currentDate.getDate() + 1);
    }

    return true;
  };

  transactionService.verify = function(transaction) {
    var currentDate = new Date(transaction.date);
    currentDate.setHours( currentDate.getHours() + 12 );
    var endDate = new Date(_date.end);
    endDate.setDate(endDate.getDate() + 1);

    if (transaction.quantity === 0) { return false; }

    while ( currentDate < endDate ) {
      var dateString = currentDate.toISOString().slice(0,10);
      
      if (transaction.type === "Buy" && _userData.balance[dateString] - transaction.total < 0) {
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

      var newTransaction = {
        date: _quotes[_date.index].date,
        stock: transaction.stock,
        price: Number(transaction.price),
        total: transaction.total,
        quantity: transaction.quantity,
        type: transaction.type
      };

      _userData.transactions.push(newTransaction);

      _updateData(transaction);
    }

  };

  transactionService.deleteTransaction = function(transaction) {
    
    var index = _userData.transactions.indexOf(transaction);
    _userData.transactions.splice(index, 1);

    if (transaction.type === "Buy") {
      transaction.type = "Sell";
    } else {
      transaction.type = "Buy";
    }

    _updateData(transaction);

  };

  return transactionService;

}]);