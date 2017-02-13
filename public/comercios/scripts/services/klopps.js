app.factory('kloppsServices', function ($q, $rootScope, $state, $http, baseValues) {

    return {
        dashboardStats: function (state) {
            var user = JSON.parse(localStorage.getItem('token'));
            return $http.get(baseValues.baseURL + '/stats/dashboard?user_token='+ user.token+'&user_email='+user.email+'&state='+ state);
        },
        kloppsRequests: function (state) {
            var user = JSON.parse(localStorage.getItem('token'));
            return $http.get(baseValues.baseURL + '/klopps/costumer_requests?user_token='+ user.token+'&user_email='+user.email+'&state='+ state);
        },
        rewardsRequests: function () {            
            var user = JSON.parse(localStorage.getItem('token'));
            return $http.get(baseValues.baseURL + '/rewards/costumer_requests?user_token='+ user.token+'&user_email='+user.email);
        },
        rewardsRequestsFinished: function () {            
            var user = JSON.parse(localStorage.getItem('token'));
            return $http.get(baseValues.baseURL + '/rewards/costumer_requests?user_token='+ user.token+'&user_email='+user.email+'&state=*');
        },
        kloppsRequestsFinished: function () {            
            var user = JSON.parse(localStorage.getItem('token'));
            return $http.get(baseValues.baseURL + '/klopps/costumer_requests?user_token='+ user.token+'&user_email='+user.email+'&state=*');
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
