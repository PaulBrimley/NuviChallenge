var app = angular.module('nuviAnalytics');

app.directive('actor', function() {
    return {
        scope: {
            data: '='
        },
        templateUrl: '../views/actorTmpl.html',
        link: function (scope, elem, attrs) {
            scope.panelActive = true;
            scope.changePanel = function () {
                scope.panelActive = !scope.panelActive;
            }
        }
    }
});