angular.module('nuviAnalytics').service('mainService', function($http) {

    this.getData = function() {
        console.log
        return $http.get('https://nuvi-challenge.herokuapp.com/activities').then(function (response) {
            return response.data;
        }).catch(function (error) {
            console.log(error);
            return false;
        })
    }
});