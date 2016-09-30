Fideligard.factory('yqlService', ['$http',  function($http) {

  var yqlService = {};
  var _companies = ["AAPL"],
      _start = "",
      _end = "";

  var _quotes = [];


  var parseData = function(response) {
    var data = response.data.query.results.quote;

    var startDate = new Date(_start);
    var currentDate = new Date(_start);
    var endDate = new Date(_end);

    endDate.setDate(endDate.getDate() + 1);
    var quotes = [];

    // add dates to an array
    while ( currentDate < endDate ) {
      var dateString = currentDate.toISOString().slice(0,10);
      var dateObj = {
        date: dateString,
        data: {}
      };

      quotes.push(dateObj);

      currentDate.setDate(currentDate.getDate() + 1);

    }

    // add stock data to array
    for (var index in data) {
      var dayDiff= new Date(data[index].Date) - startDate;
      var dateIndex = Number( Math.ceil(dayDiff / (1000 * 3600 * 24)) ) + 0;

      var symbol = data[index].Symbol;
      quotes[dateIndex].data[symbol] = data[index];
    }

    return quotes;
  };

  var urlBuilder = function(companyArray) {
    var companyString = "'" + companyArray.join("','") + "'";

    return 'http://query.yahooapis.com/v1/public/yql?q=' +
              'select * from yahoo.finance.historicaldata ' +
              'where symbol in (' + companyString + ') ' +
              'and startDate = "' + _start + '" ' +
              'and endDate = "' + _end + '" ' +
              '&format=json '+
              '&diagnostics=true ' +
              '&env=store://datatables.org/alltableswithkeys ' +
              '&callback=';
  };

  yqlService.apiStocks = function() {
    var url = urlBuilder(_companies);
    // DEV URL
    url = "/assets/dev_data.json"
    // **************
    console.log("sending data to:");
    console.log(url);

    return $http.get(url).then(function(response) {
      console.log("data returned");
      angular.copy( parseData(response), _quotes );
    }) ;
  };

  yqlService.getStocks = function() {
    return _quotes;
  };

  yqlService.setDates = function(start, end) {
    _start = start;
    _end  = end;
  };

  yqlService.setCompanies = function(companies) {
    _companies = companies;
  };


  return yqlService;

}]);