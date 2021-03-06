var Fideligard = angular.module('Fideligard', ['ui.router']);

Fideligard.config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider){

  $urlRouterProvider.otherwise("");

  $stateProvider.state('dashboard', {
    url: '',
    resolve: {
      apiStocks: ['yqlService', 'userService', function (yqlService, userService) {
        userService.init();
        return yqlService.apiStocks();
      }]
    },

    views: {
      'range@': {
        templateUrl: 'templates/range.html',
        controller: 'RangeCtrl'
      },

      'stocks@': {
        templateUrl: 'templates/stocks.html',
        controller: 'StocksCtrl'
      }
    }
  })

  .state('dashboard.portfolio', {
    url: '/portfolio',
    views: {
      '@': {
        templateUrl: 'templates/portfolio.html',
        controller: 'PortfolioCtrl'
      }
    }
  })

  .state('dashboard.trade', {
    url: '/trade',
    params: { stock: "" },
    views: {
      '@': {
        templateUrl: 'templates/trade.html',
        controller: 'TradeCtrl'
      }
    }
  })

  .state('dashboard.transaction', {
    url: '/transaction',
    views: {
      '@': {
        templateUrl: 'templates/transaction.html',
        controller: 'TransactionCtrl'
      }
    }
  });

}]);