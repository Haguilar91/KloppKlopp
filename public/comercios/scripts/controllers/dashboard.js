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
            vm.requests[state] = [];
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
            vm.requests[state] = [];
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
		vm.reloadRoute = function() {
			 $state.reload();
		}
    vm.logOut = function () {
      localStorage.removeItem('token');
      $state.go('login');
    };

  });
