Fideligard.directive("stockListing", function() {

  return {
    templateUrl: "directives/stock_listing.html",
    restrict: "A",
    scope: {
      stock: "=",
      dateIndex: "="
    }
  };

});