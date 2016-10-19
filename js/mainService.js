angular.module('nuviAnalytics').service('mainService', function($http) {
    var self = this;
    this.data = [];

    this.getData = function() {
        console.log
        return $http.get('https://nuvi-challenge.herokuapp.com/activities').then(function (response) {
            self.data = response.data;
            return true;
        }).catch(function (error) {
            console.log(error);
            return false;
        })
    }
});