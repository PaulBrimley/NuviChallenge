angular.module('nuviAnalytics').controller('analyticsController', function ($scope, mainService) {
    mainService.getData().then(function (response) {
        console.log(response);
    });
});