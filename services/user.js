Fideligard.factory('userService', ['yqlService', function(yqlService){

  var _quotes = yqlService.getStocks();
  var _companies = ["AAPL","BAC", "DB", "F", "GE", "TWTR", "JPM", "XOM", "VZ"];
  var _date = { index: 30,
                start: "2015/12/01",
                end: "2016/03/31" };
  var _startingBalance = 1000;
  var _userData = {
    balance: {},
    transactions: [],
    portfolio: {}
  };

  var _initUserData = function() {
    var currentDate = new Date(_date.start);
    currentDate.setHours( currentDate.getHours() + 12 );
    var endDate = new Date(_date.end);
    endDate.setDate(endDate.getDate() + 1);

    while ( currentDate < endDate ) {
      var dateString = currentDate.toISOString().slice(0,10);
      
      _userData.balance[dateString] = _startingBalance;

      _userData.portfolio[dateString] = {};
      for (var i = 0; i < _companies.length; i++) {
        _userData.portfolio[dateString][ _companies[i] ] = 0;
      }

      currentDate.setDate(currentDate.getDate() + 1);
    }
  };

  var userService = {};

  userService.init = function() {
    yqlService.setDates(_date.start, _date.end);
    yqlService.setCompanies(_companies);
    _initUserData();
  };

  userService.getDate = function() {
    return _date;
  };

  userService.getCompanies = function() {
    return _companies;
  };

  userService.getUserData = function() {
    return _userData;
  };

  return userService;

}]);