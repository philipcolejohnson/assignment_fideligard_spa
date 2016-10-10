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
        var quantity = portf[today][stock];

        $scope.positions.push({
          stock: stock,
          quantity: quantity,
          costBasis: costBasis,
          currentPrice: price,
          value: price * quantity,
          profit: price * quantity - costBasis,
          one: stockService.calcPriceChange(stock, -1) * quantity,
          seven: stockService.calcPriceChange(stock, -7) * quantity,
          thirty: stockService.calcPriceChange(stock, -30) * quantity
        });

      }
    }

    // summary
    $scope.summary = {
      costBasis: 0,
      value: 0,
      profit: 0,
      one: 0,
      seven: 0,
      thirty: 0
    };

    // cash
    $scope.summary.costBasis += $scope.userData.balance[ $scope.quotes[$scope.date.index].date ];
    $scope.summary.value += $scope.userData.balance[ $scope.quotes[$scope.date.index].date ];

    // stocks
    for (var i in $scope.positions) {
      $scope.summary.costBasis += $scope.positions[i].costBasis;
      $scope.summary.value += $scope.positions[i].value;
      $scope.summary.one += $scope.positions[i].one;
      $scope.summary.seven += $scope.positions[i].seven;
      $scope.summary.thirty += $scope.positions[i].thirty;
    }
    $scope.summary.profit = $scope.summary.value - $scope.summary.costBasis;
  };


}]);