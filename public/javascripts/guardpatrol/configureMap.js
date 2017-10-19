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

    let buttonValues = {
        OFF: "Auto Refresh Off",
        SIXTY: "Auto Refresh On"
    };

    autoRefreshButtonOFF = document.getElementById('autoRefreshButtonOFF');
    autoRefreshButtonSIXTY = document.getElementById('autoRefreshButtonSIXTY');
    autoRefreshButtonSIXTY.style.display = "none";

    let currentButtonValue = buttonValues.OFF;

    autoRefreshButtonOFF.addEventListener('click', function (e) {

        currentButtonValue = onAutoRefresh(autoRefreshButtonOFF, autoRefreshButtonSIXTY, buttonValues, currentButtonValue);
    });

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

    var routeMarkers = [];

    var removeCheckpointButton = document.getElementById("removeCheckpointButton");

    removeCheckpointButton.addEventListener('click', function (e) {

        onRemoveCheckpoint(route, routeMarkers);
    });


    map.addListener('click', function (e) {
        onSetCheckpoint(route, e.latLng, map, iconsBase, routeMarkers);
    });

    var saveRouteButton = document.getElementById("saveRouteButton");

    saveRouteButton.addEventListener('click', function (e) {

        onSaveRoute(route);
    });

    onLoadRoute(map, iconsBase, route, routeMarkers);

    var loadRouteButton = document.getElementById("loadRouteButton");

    loadRouteButton.addEventListener('click', function (e) {

        onLoadRoute(map, iconsBase, route, routeMarkers);
    });



}

function onSetCheckpoint(route, latLng, map, iconsBase, routeMarkers) {
    route.getPath().push(latLng);
    route.setMap(map);
    createRouteMarker(latLng, map, iconsBase, route, routeMarkers);
}

function createRouteMarker(latLng, map, iconsBase, route, routeMarkers) {


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

}

function onRemoveCheckpoint(route, routeMarkers) {
    console.log(routeMarkers);
    route.getPath().pop();
    if (routeMarkers.length > 0) {
        routeMarkers[routeMarkers.length - 1].setMap(null);
    }
    routeMarkers.pop();
}

function onSaveRoute(route) {

    var routeID = createRouteID();
    var xhr = new XMLHttpRequest();
    var route = route;

    if (!xhr) {
        alert('Giving up :( Cannot create an XMLHTTP instance');
        return false;
    }

    xhr.open("POST", "http://ec2-52-38-237-33.us-west-2.compute.amazonaws.com:3000/routes", true);

    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send(JSON.stringify({
        "RouteID": routeID,
        "RouteName": "test",
        "CurrentRoute": 1,
        "NotCurrentRoute": 0
    }));

    postCheckpoints(route, routeID);

    // now need to add the checkpoint saving -- tricky tricky 


}

function postCheckpoints(route, routeID) {
    let s = 0;
    var route = route;
    console.log("logging route:");
    console.log(route);
    var coords = route.getPath().getArray();
    console.log("logging coords:");
    console.log(coords);
    for (let latLng of coords) {
        let checkpointID = createCheckpointID();

        let xhr = new XMLHttpRequest();

        if (!xhr) {
            alert('Giving up :( Cannot create an XMLHTTP instance');
            return false;
        }

        xhr.open("POST", "http://ec2-52-38-237-33.us-west-2.compute.amazonaws.com:3000/checkpoints", true);

        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.send(JSON.stringify({
            "CheckpointID": checkpointID,
            "Sequence": s,
            "lat": latLng.lat(),
            "lng": latLng.lng(),
            "RouteID": routeID
        }));

        s++;

    }
    alert("Route has been saved as the current route!");
}

function onLoadRoute(map, iconsBase, route, routeMarkers) {

    var xhr = new XMLHttpRequest();

    if (!xhr) {
        alert('Giving up :( Cannot create an XMLHTTP instance');
        return false;
    }

    xhr.onreadystatechange = function () {
        if (xhr.readyState == XMLHttpRequest.DONE) {
            // alert(xhr.responseText);
            var json = JSON.parse(xhr.responseText);
            let routeID = json[0].RouteID;
            loadCurrentRoutes(routeID, map, iconsBase, route, routeMarkers);

        }
    }

    xhr.open("GET", "http://ec2-52-38-237-33.us-west-2.compute.amazonaws.com:3000/currentroutes", true);

    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send(null);



    // return new Promise(resolve => {
    //     this.http.get('http://ec2-52-38-237-33.us-west-2.compute.amazonaws.com:3000/currentroutes/')
    //         .map(res => res.json())
    //         .subscribe(data => {
    //             this.currentRouteData = data;
    //         });
    //     let id = this.currentRouteData[0].RouteID;

    //     //DOING SAME THING BELOW AS IN loadRoute()
    //     this.http.get('http://ec2-52-38-237-33.us-west-2.compute.amazonaws.com:3000/checkpoints/' + id)
    //         .map(res => res.json())
    //         .subscribe(data => {
    //             this.routeData = data;

    //             this.route.setPath(this.routeData);
    //             for (var i = 0; i < this.routeMarkers.length; i++) {
    //                 this.routeMarkers[i].setMap(null);
    //             }
    //             this.routeMarkers = [];
    //             for (let checkpoint of this.routeData) {
    //                 var marker = new google.maps.Marker({
    //                     position: checkpoint,
    //                     map: null,
    //                     icon: this.iconImage
    //                 });
    //                 this.routeMarkers.push(marker);
    //             }
    //         });
    //     resolve(this.routeData);
    // });


}

function loadCurrentRoutes(routeID, map, iconsBase, route, routeMarkers) {
    var xhr = new XMLHttpRequest();

    if (!xhr) {
        alert('Giving up :( Cannot create an XMLHTTP instance');
        return false;
    }

    xhr.onreadystatechange = function () {
        if (xhr.readyState == XMLHttpRequest.DONE) {
            var checkpoints = JSON.parse(xhr.responseText);
            loadRoutesOnMap(checkpoints, map, iconsBase, route, routeMarkers);

            // this gives us a string of all the current checkpoint rows
            // next we need to parse it, (which will turn it into an array of objects)
            // then we need to create a marker for each latLng
            // let's check the app to see how to do this

        }
    }

    xhr.open("GET", "http://ec2-52-38-237-33.us-west-2.compute.amazonaws.com:3000/checkpoints/" + routeID, true);

    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send(null);
}

function loadRoutesOnMap(checkpoints, map, iconsBase, route, routeMarkers) {
    console.log("loadRoutesOnMapCalled");

    // var routeSeq = {
    //     repeat: '30px',
    //     icon: {
    //         path: google.maps.SymbolPath.FORWARD_OPEN_ARROW,
    //         scale: 1,
    //         fillOpacity: 0,
    //         strokeColor: "yellow",
    //         strokeWeight: 1,
    //         strokeOpacity: 1
    //     }
    // };
    // var route = new google.maps.Polyline({
    //     map: map,
    //     zIndex: 1,
    //     geodesic: true,
    //     strokeColor: "blue",
    //     strokeOpacity: 1,
    //     strokeWeight: 7,
    //     icons: [routeSeq]
    // })

    // let routeMarkers = [];


    for (i = 0; i < checkpoints.length; i++) {
        var latLng = new google.maps.LatLng(checkpoints[i].lat, checkpoints[i].lng);
        route.getPath().push(latLng);
        createRouteMarker(latLng, map, iconsBase, route, routeMarkers);
    }




}

function createRouteID() {
    var newRouteID = Math.random().toString(36).substr(2, 9);
    return newRouteID;
}

function createCheckpointID() {
    var newCheckpointID = Math.random().toString(36).substr(2, 9);
    return newCheckpointID;
}

function onAutoRefresh(autoRefreshButtonOFF, autoRefreshButtonSIXTY, buttonValues, currentButtonValue) {


    if (currentButtonValue == buttonValues.OFF) {
        // autoRefreshButtonOFF.style.display = "none";
        currentButtonValue = buttonValues.SIXTY;
        autoRefreshButtonOFF.style.display = "none";
        autoRefreshButtonSIXTY.style.display = "inline";
    } else if (currentButtonValue == buttonValues.SIXTY) {
    }

    return currentButtonValue;


}


