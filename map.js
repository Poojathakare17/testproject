var map;
function initMap() {
    var vm = this;
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function (position) {
            var pos = {
                lat: position.coords.latitude,
                lng: position.coords.longitude
            };
            map = new google.maps.Map(document.getElementById('map'), {
                center: pos,
                zoom: 15
            });
            var service = new google.maps.places.PlacesService(map);
            service.nearbySearch({
                location: pos,
                radius: 500,
                type: ['pharmacy']
            }, callback);
        }, function () {
            handleLocationError(true, infoWindow, map.getCenter());
        });
    } else {
        handleLocationError(false, infoWindow, map.getCenter());
    }
}
function callback(results, status) {
    var obj = {};
    var Name = '';
    var PlaceId = '';

    if (status === google.maps.places.PlacesServiceStatus.OK) {
        var obj = _.cloneDeep(results);
        markLocation(obj);
    }
}
function markLocation(obj) {
    var currWindow = false;
    for (var i = 0; i < obj.length; i++) {
        var placeLoc = obj[i].geometry.location;
        var marker = new google.maps.Marker({
            map: map,
            position: obj[i].geometry.location,
            name: obj[i].name
        });
        map.setCenter(marker.getPosition());
        var content = '<div><strong>' + marker.name + '</strong><br></strong></div>';
        var infowindow = new google.maps.InfoWindow();
        google.maps.event.addListener(marker, 'click', (function (marker, content, infowindow) {
            return function () {
                if (currWindow) {
                    currWindow.close();
                }
                infowindow.setContent(content);
                currWindow = infowindow;
                infowindow.open(map, marker);
            };
        })(marker, content, infowindow));
        map.addListener('idle', function () {
            var request = {
                bounds: map.getBounds(),
                types: ['pharmacy'],
                keyword: 'mumbai'
            };
            var service = new google.maps.places.PlacesService(map);
            service.nearbySearch(request, function (results, status) {
                console.log(results);
                if (status == google.maps.places.PlacesServiceStatus.OK) {
                    markLocation(results);
                }
            });
        });
    }
}
