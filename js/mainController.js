angular.module('nuviAnalytics').controller('analyticsController', function ($scope, $timeout, mainService, mapService) {

    $scope.currentData = [];
    $scope.currentDataSet = 0;
    $scope.currentImage = '';
    $scope.currentView = '../views/actorTmpl2.html';
    $scope.data = [];
    $scope.dataSets = [];
    $scope.displayAmount = 10;
    $scope.errorMessage = 'Retrieving data.';
    $scope.userRoute = true;
    $scope.viewActive = true;

    function capitalizeFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }

    mainService.getData().then(function (response) {
        if (response && response.length) {
            $scope.data = response;
            for (var i = 0; i < $scope.data.length; i++) {
                $scope.data[i].provider = capitalizeFirstLetter($scope.data[i].provider);
                if (i % $scope.displayAmount === 0) {
                    $scope.dataSets.push(i);
                }
            }
            $scope.propagatePagination(0);
            $scope.errorMessage = '';
        } else if (response && !response.length) {
            $scope.errorMessage = 'No data returned.'
        } else {
            $scope.errorMessage = 'Something went wrong getting the data. Please try again later.';
        }
    });
    mapService.setUpMap();
    $timeout(function () {
       $('#mapModal').on('shown.bs.modal', function () {
           google.maps.event.trigger(mapService.map, 'resize');
           mapService.setMapCenter();
       })
    });

    $scope.changeRoute = function (route) {
        $scope.userRoute = !$scope.userRoute;
    };

    $scope.propagatePagination = function (index) {
        $scope.currentDataSet = index;
        $scope.currentData = $scope.data.slice($scope.dataSets[index], ($scope.dataSets[index] + $scope.displayAmount));
        console.log($scope.currentData);
    };

    $scope.setView = function (type) {
        if (type === 'list') {
            $scope.currentView = '../views/actorTmpl2.html';
            $scope.viewActive = true;
        } else {
            $scope.currentView = '../views/actorTmpl1.html';
            $scope.viewActive = false;
        }
    };

    $scope.setDisplayQuantity = function () {
        console.log($scope.dataSets);
        $scope.dataSets = [];
        for (var i = 0; i < $scope.data.length; i++) {
            if (i % $scope.displayAmount === 0) {
                $scope.dataSets.push(i);
            }
        }
        console.log($scope.dataSets);
        $scope.propagatePagination(0);
    };

    $scope.$on('imageChanged', function (event, data) {
        $scope.currentImage = data;
        $('#imageModal').modal('show');
    })


});