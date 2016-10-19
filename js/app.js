var app = angular.module('nuviAnalytics', ['ngAnimate', 'ui.router'])

.config(function ($stateProvider, $urlRouterProvider) {
    $stateProvider
    .state('user', {
        url: '/user',
        templateUrl: '../views/userViewTmpl.html',
        controller: function ($scope, $state, $timeout, mainService, mapService) {

            $scope.currentData = [];
            $scope.currentDataSet = 0;
            $scope.currentDataIndex = undefined;
            $scope.currentImage = '';
            $scope.currentView = '../views/actorTmpl2.html';
            $scope.data = mainService.data;
            $scope.dataSets = [];
            $scope.displayAmount = 10;
            $scope.errorMessage = 'Retrieving data.';
            $scope.message = '';
            $scope.userRoute = 'user';
            $scope.viewActive = true;

            function capitalizeFirstLetter(string) {
                return string.charAt(0).toUpperCase() + string.slice(1);
            }

            mapService.setUpMap();
            $timeout(function () {
                $('#mapModal').on('shown.bs.modal', function () {
                    google.maps.event.trigger(mapService.map, 'resize');
                    mapService.setMapCenter();
                });
                $('#replyModal').on('hidden.bs.modal', function () {
                    $scope.message = '';
                });
            });

            $scope.changeRoute = function (route) {
                $state.go(route);
            };

            $scope.propagatePagination = function (index) {
                $scope.currentDataSet = index;
                $scope.currentData = $scope.data.slice($scope.dataSets[index], ($scope.dataSets[index] + $scope.displayAmount));
                $('body').animate({scrollTop: 0}, 500);
                $timeout(function () {
                    if ($('#actorArea').height() >= $(window).height()) {
                        $('.backgroundHolder').height($('#actorArea').height());
                    } else {
                        $('.backgroundHolder').height('100%');
                    }
                }, 1000);
            };

            $scope.reply = function (index) {
                $('#replyModal').modal('show');
                $scope.currentDataIndex = index;
            };

            $scope.sendMessage = function () {
                $scope.currentData[$scope.currentDataIndex].activity_comments++;
            };

            $scope.setView = function (type) {
                if (type === 'list') {
                    $scope.currentView = '../views/actorTmpl2.html';
                    $scope.viewActive = true;
                } else {
                    $scope.currentView = '../views/actorTmpl1.html';
                    $scope.viewActive = false;
                }
                $('body').animate({scrollTop: 0}, 500);
                $timeout(function () {
                    $('.backgroundHolder').height($('#actorArea').height());
                }, 1000);
            };

            $scope.setDisplayQuantity = function () {
                $scope.dataSets = [];
                for (var i = 0; i < $scope.data.length; i++) {
                    if (i % $scope.displayAmount === 0) {
                        $scope.dataSets.push(i);
                    }
                }
                $scope.propagatePagination(0);
            };

            $scope.setUp = function () {
                for (var i = 0; i < $scope.data.length; i++) {
                    $scope.data[i].provider = capitalizeFirstLetter($scope.data[i].provider);
                    if (i % $scope.displayAmount === 0) {
                        $scope.dataSets.push(i);
                    }
                }
                $scope.propagatePagination(0);
                $scope.errorMessage = '';
            };

            if (!$scope.data.length) {
                mainService.getData().then(function (response) {
                    if (response && mainService.data.length) {
                        $scope.data = mainService.data;
                        $scope.setUp();
                    } else if (response && !mainService.data.length) {
                        $scope.errorMessage = 'No data returned.'
                    } else {
                        $scope.errorMessage = 'Something went wrong getting the data. Please try again later.';
                    }
                });
            } else {
                $scope.setUp();
            }

            $scope.$on('imageChanged', function (event, data) {
                $scope.currentImage = data;
                $('#imageModal').modal('show');
            });
        }
    })
    .state('admin', {
        url: '/admin',
        templateUrl: '../views/adminViewTmpl.html',
        controller: function ($scope, $state, $timeout, mainService, mapService) {

            $scope.data = mainService.data;
            $scope.errorMessage = '';
            $scope.mostComments = 0;
            $scope.mostLikes = 0;
            $scope.mostShares = 0;
            $scope.providerObj = {};
            $scope.userRoute = 'admin';

            function capitalizeFirstLetter(string) {
                return string.charAt(0).toUpperCase() + string.slice(1);
            }


            $scope.changeRoute = function (route) {
                $state.go(route);
            };

            $scope.setUp = function () {
                $('body').animate({scrollTop: 0}, 500);
                for (var i = 0; i < $scope.data.length; i++) {
                    $scope.data[i].provider = capitalizeFirstLetter($scope.data[i].provider);
                    if (!$scope.providerObj.hasOwnProperty($scope.data[i].provider)) {
                        $scope.providerObj[$scope.data[i].provider] = {
                            title: $scope.data[i].provider,
                            likes: 0,
                            shares: 0,
                            comments: 0
                        }
                    }
                    if ($scope.data[i].activity_likes) {
                        $scope.providerObj[$scope.data[i].provider].likes += $scope.data[i].activity_likes;
                    }
                    if ($scope.data[i].activity_shares) {
                        $scope.providerObj[$scope.data[i].provider].shares += $scope.data[i].activity_shares;
                    }
                    if ($scope.data[i].activity_comments) {
                        $scope.providerObj[$scope.data[i].provider].comments += $scope.data[i].activity_comments;
                    }
                }
                for (var prop in $scope.providerObj) {
                    if ($scope.providerObj[prop].likes > $scope.mostLikes) {
                        $scope.mostLikes = $scope.providerObj[prop].likes;
                    }
                    if ($scope.providerObj[prop].shares > $scope.mostShares) {
                        $scope.mostShares = $scope.providerObj[prop].shares;
                    }
                    if ($scope.providerObj[prop].comments > $scope.mostComments) {
                        $scope.mostComments = $scope.providerObj[prop].comments;
                    }
                }
                $timeout(function () {
                    for (var prop in $scope.providerObj) {
                        $('#likes' + prop).width(($scope.providerObj[prop].likes / $scope.mostLikes * 100) + '%');
                        $('#shares' + prop).width(($scope.providerObj[prop].shares / $scope.mostShares * 100) + '%');
                        $('#comments' + prop).width(($scope.providerObj[prop].comments / $scope.mostComments * 100) + '%');
                    }
                }, 100);
                $timeout(function () {
                    $('.backgroundHolder').height($('body').height());
                }, 1000);
            };

            if (!$scope.data.length) {
                mainService.getData().then(function (response) {
                    if (response && mainService.data.length) {
                        $scope.data = mainService.data;
                        $scope.setUp();
                    } else if (response && !mainService.data.length) {
                        $scope.errorMessage = 'No data returned.'
                    } else {
                        $scope.errorMessage = 'Something went wrong getting the data. Please try again later.';
                    }
                });
            } else {
                $scope.setUp();
            }
        }
    });

    $urlRouterProvider.otherwise('/user');
});