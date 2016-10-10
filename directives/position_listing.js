Fideligard.directive("positionListing", ['userService',  'transactionService', function(userService, transactionService) {

  return {
    templateUrl: "directives/position_listing.html",
    restrict: "A",
    scope: {
      position: "="
    },
    link: function(scope) {
      scope.userData = userService.getUserData();
    }
  };

}]);