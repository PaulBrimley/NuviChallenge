angular.module('nuviAnalytics').controller('analyticsController', function ($scope, $timeout, mainService) {

    $scope.currentData = [];
    $scope.currentDataSet = 0;
    $scope.data = [];
    $scope.dataSets = [];
    $scope.displayAmmount = 10;
    $scope.errorMessage = 'Retrieving data.';

    mainService.getData().then(function (response) {
        if (response && response.length) {
            $scope.data = response;
            for (var i = 0; i < $scope.data.length; i++) {
                if (i % $scope.displayAmmount === 0) {
                    $scope.dataSets.push(i);
                }
            }
            console.log($scope.dataSets);
            $scope.propagatePagination(0);
            $scope.errorMessage = '';
        } else if (response && !response.length) {
            $scope.errorMessage = 'No data returned.'
        } else {
            $scope.errorMessage = 'Something went wrong getting the data. Please try again later.';
        }
    });

    $scope.next = function () {
        $scope.currentDataSet = $scope.currentDataSet + 1;
    };

    $scope.previous = function () {

    };

    $scope.propagatePagination = function (index) {
        console.log('clicked', index);
        $scope.currentDataSet = index;
        $scope.currentData = $scope.data.slice($scope.dataSets[index], ($scope.dataSets[index] + 10));
        // console.log($scope.data);
        // console.log($scope.currentData);
    }

});