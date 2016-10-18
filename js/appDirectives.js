var app = angular.module('nuviAnalytics');

app.directive('actor', function($rootScope, $timeout, mapService) {
    return {
        scope: {
            data: '='
        },
        template: '<div ng-include="contentUrl"></div>',
        link: function (scope, elem, attrs) {
            scope.panelActive = true;
            scope.changePanel = function () {
                scope.panelActive = !scope.panelActive;
            };

            scope.viewImage = function () {
                $rootScope.$broadcast('imageChanged', scope.data.activity_attachment);
            };

            scope.viewMap = function () {
                mapService.center = {
                    lat: scope.data.activity_latitude,
                    lng: scope.data.activity_longitude
                };
                $('#mapModal').modal('show');
            };

            // scope.contentUrl = '../views/actorTmpl.html';
            attrs.$observe('template', function (template) {
               scope.contentUrl = template;
            });
        }
    }
});