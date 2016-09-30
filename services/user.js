Fideligard.factory('userService', ['yqlService', function(yqlService){

  var _quotes = yqlService.getStocks();
  var _companies = ["AAPL","ABC"];
  var _date = { index: 182,
                start: "2015/01/01",
                end: "2015/12/31" };

  var userService = {};

  userService.setOptions = function() {
    yqlService.setDates(_date.start, _date.end);
    yqlService.setCompanies(_companies);
  };

  userService.getDate = function() {
    return _date;
  };

  return userService;

}]);