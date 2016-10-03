Fideligard.directive("transactionListing", ['userService',  'transactionService', function(userService, transactionService) {

  return {
    templateUrl: "directives/transaction_listing.html",
    restrict: "A",
    scope: {
      transaction: "="
    },
    link: function(scope) {
      scope.userData = userService.getUserData();

      scope.delete = function(transaction) {
        transactionService.deleteTransaction(transaction);
      };
    }
  };

}]);