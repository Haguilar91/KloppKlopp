'use strict';

/**
 * @ngdoc overview
 * @name yapp
 * @description
 * # yapp
 *
 * Main module of the application.
 */
var app = angular
  .module('yapp', [
    'ui.router',
    'toaster',
    'ngMaterial',
    'ngAnimate'    
  ]);

app.run(function ($rootScope, $state) {
  $rootScope.$on("$stateChangeStart", function (event, toState, toParams, fromState, $stateParams) {
    var userToken = JSON.parse(localStorage.getItem('token'));
    if (userToken && toState.name == 'login') {
      $state.go('dashboard', {}, { notify: false });
      event.preventDefault();
      return;
    }
    else if (!userToken && toState.name == 'reset' && toParams.token) {
      $state.go('reset', { token: toParams.token });
      event.preventDefault();
      return;
    }
    else if (!userToken && toState.name == 'forgot') {
      $state.go('forgot');
      event.preventDefault();
      return;
    }
    else if (!userToken && toState.name != 'login') {
      $state.go('login');
      event.preventDefault();
      return;
    }
  });
});

app.constant('baseValues', {
  baseURL: 'http://klopp.co/api/v1'
});
  app.config(function($stateProvider, $urlRouterProvider) {

    $urlRouterProvider.when('/dashboard', '/dashboard/overview');
    $urlRouterProvider.otherwise('/login');

    $stateProvider
      .state('base', {
        abstract: true,
        url: '',
        templateUrl: 'views/base.html'
      })
        .state('login', {
          url: '/login',
          parent: 'base',
          templateUrl: 'views/login.html',
          controller: 'LoginCtrl as vm'
        })
        .state('dashboard', {
          url: '/dashboard',
          parent: 'base',
          params:{
            business:null
          },
          templateUrl: 'views/dashboard.html',
          controller: 'DashboardCtrl as vm'
        })
          .state('overview', {
            url: '/overview',
            parent: 'dashboard',
            templateUrl: 'views/dashboard/overview.html'
          })
          .state('reports', {
            url: '/reports',
            parent: 'dashboard',
            templateUrl: 'views/dashboard/reports.html'
          });

  });
