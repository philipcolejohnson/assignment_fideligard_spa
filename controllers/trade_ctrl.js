Fideligard.controller('TradeCtrl', ['$scope', 'yqlService', 'stockService', 'userService', '$stateParams', 'transactionService', function($scope, yqlService, stockService, userService, $stateParams, transactionService){

  $scope.transaction = {
    stock: $stateParams.stock,
    date: "",
    quantity: 1,
    price: 0,
    type: "Buy",
    current_balance: 0,
    total: 0,
    valid: true
  };

  $scope.quotes = yqlService.getStocks();
  $scope.date = userService.getDate();
  $scope.companies = userService.getCompanies();
  $scope.userData = userService.getUserData();

  $scope.$watch('date.index', function(){
    updateInformation();
  });

  $scope.$watch('transaction.stock', function(){
    updateInformation();
  });

  $scope.$watch('transaction.quantity', function(){
    updateInformation();
  });

  $scope.$watch('transaction.type', function(){
    updateInformation();
  });

  var updateInformation = function() {

    if (!$scope.transaction.stock) {
      $scope.transaction.stock = $scope.companies[0];
    }

    $scope.transaction.date = $scope.quotes[$scope.date.index].date;

    $scope.transaction.price = stockService.findLatestPrice($scope.transaction.stock, $scope.date.index);

    $scope.transaction.total = $scope.transaction.quantity * $scope.transaction.price;

    $scope.transaction.current_balance = $scope.userData.balance[ $scope.quotes[$scope.date.index].date ];
    
    $scope.transaction.valid = transactionService.verify($scope.transaction);
    angular.element( document.querySelector( '#btn-submission' ) ).prop('disabled', !$scope.transaction.valid);
  };

  $scope.makeTransaction = function() {
    if(!$scope.transaction.valid) { return false; }

    transactionService.addTransaction($scope.transaction);
    updateInformation();

    return true;
  };

  updateInformation();

}]);
