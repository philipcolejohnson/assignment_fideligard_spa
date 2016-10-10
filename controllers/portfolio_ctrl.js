Fideligard.controller('PortfolioCtrl', ['$scope', 'yqlService', 'userService', 'transactionService', 'stockService', function($scope, yqlService, userService, transactionService, stockService){

  $scope.quotes = yqlService.getStocks();
  $scope.date = userService.getDate();
  $scope.userData = userService.getUserData();

  $scope.positions = [];

  $scope.$watch('date.index', function(){
    generatePortfolio();
  });

  var updateListings = function() {
    $scope.listings = [];
    $scope.companies.forEach(function(stock) {
      $scope.listings.push( setStockListings(stock) );
    });
  };


  $scope.transFilter  = {
    type: "date",
    rev: false
  };

  $scope.toggleFilter = function(filter) {
    if ($scope.transFilter.type === filter) {
      $scope.transFilter.rev = !$scope.transFilter.rev;
    } else {
      $scope.transFilter.type = filter;
      $scope.transFilter.rev = false;
    }
  };

  var generatePortfolio = function() {
    // FIFO method
    var portf = $scope.userData.portfolio;
    $scope.positions = [];
    var transactions = angular.copy($scope.userData.transactions, []);
    var today = $scope.quotes[ $scope.date.index ].date;

    // sort transactions by date 
    transactions.sort(function(a, b) {
        if (a.date < b.date) {
          return -1;
        }

        if (a.date > b.date) {
          return 1;
        } else {
          return 0;
        }
    });

    for (var stock in portf[today]) {
      if (portf[today][stock]) {
        var costBasis = 0;

        var queue = [];
        var queuePos = 0;
        for (var index in transactions) {
          if (transactions[index].stock === stock && transactions[index].date <= today) {

            if (transactions[index].type === "Buy") {
              // add it to the queue
              queue.push({
                quantity: transactions[index].quantity,
                price: transactions[index].price
              });

              // add to costBasis
              costBasis += transactions[index].quantity * transactions[index].price;
            } else {
              // subtract from the queue
              var remaining = transactions[index].quantity;

              while (remaining) {
                if (queue[queuePos].quantity - remaining >= 0) {
                  costBasis -= remaining * queue[queuePos].price;
                  queue[queuePos].quantity -= remaining;
                  remaining = 0;
                } else {
                  costBasis -= queue[queuePos].quantity * queue[queuePos].price;
                  remaining -= queue[queuePos].quantity;
                  queuePos++;
                }
              }
            }
            

          }
          
        }
        // create position
        var price = stockService.findLatestPrice(stock, $scope.date.index);

        $scope.positions.push({
          stock: stock,
          quantity: portf[today][stock],
          costBasis: costBasis,
          currentPrice: price,
          value: price * portf[today][stock],
          profit: price * portf[today][stock] - costBasis,
          one: stockService.calcPriceChange(stock, -1),
          seven: stockService.calcPriceChange(stock, -7),
          thirty: stockService.calcPriceChange(stock, -30)
        });

      }
    }


  };

  generatePortfolio();

}]);