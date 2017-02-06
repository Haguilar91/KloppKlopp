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
