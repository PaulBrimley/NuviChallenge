angular.module('nuviAnalytics').service('mapService', function () {

    var self = this;
    this.map;
    this.marker;
    this.center;

    this.setUpMap = function() {
        var uluru = {lat: -25.363, lng: 131.044};
        self.map = new google.maps.Map(document.getElementById('map'), {
            zoom: 2,
            center: uluru
        });
        self.marker = new google.maps.Marker({
            position: uluru,
            map: self.map
        });
        /*map = new google.maps.Map(document.getElementById('map'), {
            zoom: 9,
            mapTypeId: google.maps.MapTypeId.ROADMAP
        });*/
    };

    this.setMapCenter = function () {
        self.map.setCenter(new google.maps.LatLng(self.center.lat, self.center.lng));
        self.marker.setPosition(new google.maps.LatLng(self.center.lat, self.center.lng));
    }
});