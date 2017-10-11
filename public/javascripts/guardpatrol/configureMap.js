function initMap() {

    var iconsBase = "http://maps.google.com/mapfiles/"

    var map = new google.maps.Map(document.getElementById('map'), {
        zoom: 20,
        center: { lat: locations[0].lat, lng: locations[0].lng },
        mapTypeId: google.maps.MapTypeId.SATELLITE,
        streetViewControl: false,
        clickableIcons: false,
        fullscreenControl: false,
        mapTypeControl: false,
        panControl: false,
        rotateControl: false

    });

    createGuardMarkers(locations, map, iconsBase);

    createIncidentMarkers(incidents, map, iconsBase);

    createPatrolPaths(patrols, coords, map);

    createRoutes(map, iconsBase);

}

function createGuardMarkers(locations, map, iconsBase) {
    for (i = 0; i < locations.length; i++) {
        var lat = locations[i].lat;
        var lng = locations[i].lng;
        var marker = new google.maps.Marker({
            position: { lat: lat, lng: lng },
            map: map,
            icon: iconsBase + "ms/micons/police.png",
            animation: google.maps.Animation.BOUNCE,
        });
    }
}

function createIncidentMarkers(incidents, map, iconsBase) {
    for (i = 0; i < incidents.length; i++) {
        var lat = incidents[i].lat;
        var lng = incidents[i].lng;
        var marker = new google.maps.Marker({
            position: { lat: lat, lng: lng },
            map: map,
            icon: iconsBase + "kml/pal3/icon59.png",
            animation: google.maps.Animation.BOUNCE,
        });
    }
}

function createPatrolPaths(patrols, coords, map) {
    for (patrolsIndex = 0; patrolsIndex < patrols.length; patrolsIndex++) {
        // create a polyline for each
        var patrolSeq = {
            repeat: '30px',
            icon: {
                path: google.maps.SymbolPath.FORWARD_OPEN_ARROW,
                scale: 1,
                fillOpacity: 0,
                strokeColor: "red",
                strokeWeight: 1,
                strokeOpacity: 1
            }
        };
        var patrol = new google.maps.Polyline({
            map: map,
            zIndex: 1,
            geodesic: true,
            strokeColor: "purple",
            strokeOpacity: 1,
            strokeWeight: 5,
            icons: [patrolSeq]
        })
        for (i = 0; i < coords.length; i++) {
            if (coords[i].PatrolID == patrols[patrolsIndex].PatrolID) {
                var latLng = new google.maps.LatLng(coords[i].lat, coords[i].lng);
                if (i > 0) {
                    var lastLocation = new google.maps.LatLng(coords[i - 1].lat, coords[i - 1].lng);
                    console.log(latLng.lat());
                    console.log(lastLocation.lat());
                    var locAccurate = locationIsAccurate(latLng, lastLocation);
                    if (locAccurate) {
                        patrol.getPath().push(latLng);
                    } else {
                        patrol.getPath().pop();
                    }
                } else {
                    patrol.getPath().push(latLng);
                }
            }
        }
    }
}

function createRoutes(map, iconsBase) {

    var routeMarkers = [];

    var routeSeq = {
        repeat: '30px',
        icon: {
            path: google.maps.SymbolPath.FORWARD_OPEN_ARROW,
            scale: 1,
            fillOpacity: 0,
            strokeColor: "yellow",
            strokeWeight: 1,
            strokeOpacity: 1
        }
    };
    var route = new google.maps.Polyline({
        map: map,
        zIndex: 1,
        geodesic: true,
        strokeColor: "blue",
        strokeOpacity: 1,
        strokeWeight: 7,
        icons: [routeSeq]
    })

    map.addListener('click', function (e) {
        onSetCheckpoint(route, e.latLng, map, iconsBase);
    });

}

function onSetCheckpoint(route, latLng, map, iconsBase) {
    route.getPath().push(latLng);
    route.setMap(map);
    createRouteMarker(latLng, map, iconsBase, route);
}

function createRouteMarker(latLng, map, iconsBase, route){


    var routeMarker = new google.maps.Marker({
        animation: google.maps.Animation.DROP,
        position: latLng,
        map: map,
        icon: iconsBase + "ms/micons/flag.png" 
    })

    routeMarkers.push(routeMarker);

    routeMarker.addListener('click', function (e) {

        route.getPath().push(e.latLng);
        route.setMap(map);

        var routeMarker = new google.maps.Marker({
            position: e.latLng,
            map: map,
            icon: iconsBase + "ms/micons/flag.png"
        });

        routeMarkers.push(routeMarker);
    })

    var removeCheckpointButton = document.getElementById("removeCheckpointButton");
    
        removeCheckpointButton.addEventListener('click', function (e) {
            onRemoveCheckpoint(route, routeMarkers);
        });
}

function onRemoveCheckpoint(route, routeMarkers){
        route.getPath().pop();
        if (routeMarkers.length > 0) {
            routeMarkers[routeMarkers.length - 1].setMap(null);
          }
}


