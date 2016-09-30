Fideligard.factory('userService', ['yqlService', function(yqlService){

  var _quotes = yqlService.getStocks();
  var _companies = ["AAPL","BAC", "DB", "F", "GE", "TWTR", "JPM", "XOM", "VZ"];
  var _date = { index: 30,
                start: "2015/12/01",
                end: "2016/03/31" };

  var userService = {};

  userService.setOptions = function() {
    yqlService.setDates(_date.start, _date.end);
    yqlService.setCompanies(_companies);
  };

  userService.getDate = function() {
    return _date;
  };

  userService.getCompanies = function() {
    return _companies;
  };

  return userService;

}]);