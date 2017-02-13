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
        if(klopp.action == "accept")
        {
		      kloppsServices.kloppsRedeem(klopp.id, klopp.total, klopp.invoice).then(function (data) {
		        if (data.status == 200) {
		          toaster.pop("success", "Klopp Klopp", "Los klopps se han entregado correctamente");
		        }
		      })
        }else if(klopp.action=="reject")
        {
          kloppsServices.kloppsReject(klopp.id).then(function (data) {
            if (data.status == 200) {
              toaster.pop("success", "Klopp Klopp", "Se ha rechazado la solicitud de klopps correctamente");
            }
          })
        }
      }, function (err) {
        if (err) {
          toaster.pop("error", "Klopp Klopp", "Ha ocurrido un error al entregar los klopps");
        }
      });
    };

    $scope.showRewardsModal = function (ev, user) {
      $mdDialog.show({
        locals: { user: user },
        controller: RewardsDialogController,
        templateUrl: 'views/modal_rewards.html',
        targetEvent: ev,
      }).then(function (reward) {
        if(reward.action == "accept")
        {
          kloppsServices.rewardsRedeem(reward.id).then(function (data) {
            if (data.status == 200) {
              toaster.pop("success", "Klopp Klopp", "El premio se han redimido correctamente");
            }
          })
        }else if(reward.action=="reject")
        {
          kloppsServices.rewardsReject(reward.id).then(function (data) {
            if (data.status == 200) {
              toaster.pop("success", "Klopp Klopp", "Se ha rechazado el premio correctamente");
            }
          })
        }
      }, function (err) {
        if (err) {
          toaster.pop("error", "Klopp Klopp", "Ha ocurrido un error al rechazar el premio");
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
      $scope.answer = function (klopp, action) {
        klopp.id = $scope.user.costumer_request.id;
				klopp.action = action;
        $mdDialog.hide(klopp);
      };
    };

    function RewardsDialogController($scope, $mdDialog, user) {
      $scope.klopp = {};
      $scope.user = user;
      $scope.hide = function () {
        $mdDialog.hide();
      };
      $scope.cancel = function () {
        $mdDialog.cancel();
      };
      $scope.answer = function (reward, action) {
        reward.id = $scope.user.costumer_request.id;
				reward.action = action;
        $mdDialog.hide(reward);
      };
    };

    vm.getKloppRequests = function (state) {
      kloppsServices.kloppsRequests(state).then(function (data) {
        if (data.status === 200) {
          //if (data.data.costumer_requests.length > 0) {
            vm.requests[state] = data.data.costumer_requests;
          //} else {
  //          vm.requests[state] = [];
          //}
        }
      }, function (err) {

      })
    };

    vm.getRewardRequests = function (state) {
      kloppsServices.rewardsRequests(state).then(function (data) {
        if (data.status === 200) {
          //if (data.data.costumer_requests.length > 0) {
            vm.requests[state] = data.data.costumer_requests;
          //} else {
          //  vm.requests[state] = [];
          //}
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

    vm.getKloppRequestsFinished = function () {
      kloppsServices.kloppsRequestsFinished().then(function (data) {
        if (data.status === 200) {
          if (data.data.costumer_requests.length > 0) {
            vm.requests.completed = data.data.costumer_requests;
          } else {
            vm.requests.completed = []
          }
        }
      }, function (err) {

      })
    };

    vm.getRewardRequestsFinished = function () {
      kloppsServices.rewardsRequestsFinished().then(function (data) {
        if (data.status === 200) {
          if (data.data.costumer_requests.length > 0) {
            vm.requests.completed = data.data.costumer_requests;
          } else {
            vm.requests.completed = []
          }
        }
      }, function (err) {

      })
    };

    vm.getDashboardsStats = function () {
      kloppsServices.dashboardStats().then(function (data) {
        if (data.status === 200) {
          vm.rewards = data.data.rewards
          vm.users = data.data.users
        }else
        {
          vm.rewards = []
          vm.users = []
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
