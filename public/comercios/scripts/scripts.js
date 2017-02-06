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

'use strict';

angular.module('yapp').controller('LoginCtrl', function ($scope, $state, authService, toaster) {
    var vm = this;

    vm.submit = function () {
      authService.logIn($scope.user).then(function (data) {
        localStorage.setItem('token', JSON.stringify({ token: data.data.authentication_token, email: data.data.user.email }));
        
        $state.go('dashboard',{ business: data.data.business } );
        toaster.pop("success", "Bienvenido", "Klopp Klopp");

      }, function (err) {
        toaster.pop("error", "Credenciales inválidas", "Ha ocurrido un error al iniciar sesión")
      })
    };

  });

app.factory('authService', function ($q, $rootScope, $state, $http) {

    return {
        logIn: function (user) {
            return $http.post('http://klopp.co/api/v1/users/sign_in', {
                "user": {
                    "email": user.email,
                    "password": user.password
                }
            }
            );
        },
        signUp: function (user) {
            return $http.post('http://klopp.co/api/v1/users',
                { "user": { "email": user.email, "password": user.password, "username": user.username } }

            );
        }
    }
});
app.factory('kloppsServices', function ($q, $rootScope, $state, $http, baseValues) {

    return {
        kloppsRequests: function (state) {            
            var user = JSON.parse(localStorage.getItem('token'));
            return $http.get(baseValues.baseURL + '/klopps/costumer_requests?user_token='+ user.token+'&user_email='+user.email+'&state='+ state);
        },
        rewardsRequests: function () {            
            var user = JSON.parse(localStorage.getItem('token'));
            return $http.get(baseValues.baseURL + '/rewards/costumer_requests?user_token='+ user.token+'&user_email='+user.email);
        },
        kloppsRequestsCompleted: function () {
            var user = JSON.parse(localStorage.getItem('token'));
            return $http.get(baseValues.baseURL + '/klopps/log?user_token='+ user.token+'&user_email='+user.email);
        },
        rewardsRequestsCompleted: function () {
            var user = JSON.parse(localStorage.getItem('token'));
            return $http.get(baseValues.baseURL + '/rewards/log?user_token='+ user.token+'&user_email='+user.email);
        },
        kloppsRedeem: function (klopp_id, klopps, invoice) {
            var user = JSON.parse(localStorage.getItem('token'));
            return $http.post(baseValues.baseURL + '/klopps/redeem', {
                "user_token": user.token,
                "user_email": user.email,
                "klopp_request_id": klopp_id,
                "klopps":klopps, 
                "invoice_number":invoice
            }

            );
        },
        rewardsRedeem: function (reward_id) {
            var user = JSON.parse(localStorage.getItem('token'));
            return $http.post(baseValues.baseURL + '/rewards/redeem', {
                "user_token": user.token,
                "user_email": user.email,
                "reward_request_id": reward_id
            }

            );
        },
        kloppsReject: function (klopp_id) {
            var user = JSON.parse(localStorage.getItem('token'));
            return $http.post(baseValues.baseURL + '/klopps/reject_request', {
                "user_token": user.token,
                "user_email": user.email,
                "klopp_request_id": klopp_id
            }

            );
        },
        rewardsReject: function (reward_id) {
            var user = JSON.parse(localStorage.getItem('token'));
            return $http.post(baseValues.baseURL + '/rewards/reject_request', {
                "user_token": user.token,
                "user_email": user.email,
                "reward_request_id": reward_id
            }

            );
        }
    }
});

'use strict';

angular.module('yapp')

  .controller('DashboardCtrl', function ($scope, $state, $stateParams, kloppsServices, $mdDialog, toaster) {
    var vm = this;
    vm.requests = {
      pending: [],
      completed: []
    };

    $scope.$state = $state;
    if ($stateParams.business) {
      localStorage.setItem('business', JSON.stringify($stateParams.business));
      vm.logo = "http://klopp.co" + $stateParams.business.image.url;
      vm.businessName = $stateParams.business.name;
    } else {
      var business = JSON.parse(localStorage.getItem('business'));
      vm.logo = "http://klopp.co" + business.image.url;
      vm.businessName = business.name;
    }

    $scope.showAdd = function (ev, user) {
      $mdDialog.show({
        locals: { user: user },
        controller: DialogController,
        templateUrl: 'views/modal.html',
        targetEvent: ev,
      }).then(function (klopp) {
        kloppsServices.kloppsRedeem(klopp.id, klopp.total, klopp.invoice).then(function (data) {
          if (data.status == 200) {
            toaster.pop("success", "Klopp Klopp", "Los klopps se han entregado correctamente");
          }
        })
      }, function (err) {
        if (err) {
          toaster.pop("error", "Klopp Klopp", "Ha ocurrido un error al entregar los klopps");
        }
      });
    };

    $scope.showRewardsModal = function (ev, user) {
      $mdDialog.show({
        locals: { user: user },
        controller: DialogController,
        templateUrl: 'views/modal_rewards.html',
        targetEvent: ev,
      }).then(function (reward) {
        kloppsServices.rewardsRedeem(reward.id).then(function (data) {
          if (data.status == 200) {
            toaster.pop("success", "Klopp Klopp", "El premio se han redimido correctamente");
          }
        })
      }, function (err) {
        if (err) {
          toaster.pop("error", "Klopp Klopp", "Ha ocurrido un error al redimir el premio");
        }
      });
    };

    function DialogController($scope, $mdDialog, user) {
      $scope.klopp = {};
      $scope.user = user;
      $scope.hide = function () {
        $mdDialog.hide();
      };
      $scope.cancel = function () {
        $mdDialog.cancel();
      };
      $scope.answer = function (klopp) {
        klopp.id = $scope.user.costumer_request.id;
        $mdDialog.hide(klopp);
      };
    };

    vm.getKloppRequests = function (state) {
      kloppsServices.kloppsRequests(state).then(function (data) {
        if (data.status === 200) {
          if (data.data.costumer_requests.length > 0) {
            vm.requests[state] = data.data.costumer_requests;
          } else {

          }
        }
      }, function (err) {

      })
    };

    vm.getRewardRequests = function (state) {
      kloppsServices.rewardsRequests(state).then(function (data) {
        if (data.status === 200) {
          if (data.data.costumer_requests.length > 0) {
            vm.requests[state] = data.data.costumer_requests;
          } else {

          }
        }
      }, function (err) {

      })
    };

    vm.getKloppRewards = function () {
      kloppsServices.kloppsRequestsCompleted().then(function (data) {
        if (data.status === 200) {
          if (data.data.log.length > 0) {
            vm.requests.completed = data.data.log;
          } else {

          }
        }
      }, function (err) {

      })
    };

    vm.getRewardRequestsCompleted = function () {
      kloppsServices.rewardsRequestsCompleted().then(function (data) {
        if (data.status === 200) {
          if (data.data.log.length > 0) {
            vm.requests.completed = data.data.log;
          } else {

          }
        }
      }, function (err) {

      })
    };

    vm.logOut = function () {
      localStorage.removeItem('token');
      $state.go('login');
    };

  });
