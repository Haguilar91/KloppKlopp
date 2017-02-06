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