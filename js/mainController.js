angular.module('nuviAnalytics').controller('analyticsController', function ($scope) {


    function isElementInViewport (el) {

        if (typeof jQuery === "function" && el instanceof jQuery) {
            el = el[0];
        }

        if (el) {
            var rect = el.getBoundingClientRect();
            return rect.bottom;
        } else {
            return 0;
        }


    }



    $(window).scroll(function () {
        var windowScroll = $(this).scrollTop();
        $('.backgroundHolder').css({
            'transform': 'translate(0px, ' + (windowScroll / 2) + 'px)'
        });
        if (isElementInViewport($('#actorArea')) <= $(window).height() + 20) {
            scroll++;
            $(window).scrollTop(windowScroll - scroll);
        } else {
            scroll = 0;
        }
    });
});