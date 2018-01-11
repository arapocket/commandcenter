
function imageError() {

    console.log('image error called');
    let incidentImage = parent.document.getElementById('incidentImage');
    incidentImage.style.display = 'none';

}

function initMap() {
    console.log("initMap called");
    var iconsBase = "http://maps.google.com/mapfiles/"


    if (locations.length > 0) {
        var map = new google.maps.Map(document.getElementById('map'), {
            zoom: 20,
            center: { lat: locations[0].lat, lng: locations[0].lng },
            mapTypeId: google.maps.MapTypeId.SATELLITE,
            streetViewControl: false,
            clickableIcons: false,
            fullscreenControl: false,
            mapTypeControl: true,
            panControl: false,
            rotateControl: false,


        });

        createGuardMarkers(locations, map, iconsBase);

        createIncidentMarkers(incidents, map, iconsBase);

        createPatrolPaths(patrols, coords, map);

        createRoutes(map, iconsBase);

        createGuardButtons(map, locations);

        createIncidentButtons(map, incidents);



    } else {
        var mapSpace = document.getElementById('map');
        mapSpace.innerHTML = '<object width="100%" height="100%" data="/locationerror.html"></object>';
    }


    let buttonValues = {
        OFF: "Auto Refresh Off",
        TEN: "Auto Refresh On"
    };


    autoRefreshButtonOFF = parent.document.getElementById('autoRefreshButtonOFF');
    autoRefreshButtonTEN = parent.document.getElementById('autoRefreshButtonTEN');

    var currentButtonValue = localStorage.getItem("currentButtonValue");
    console.log(currentButtonValue);

    if (currentButtonValue == buttonValues.OFF) {
        autoRefreshButtonTEN.style.display = "none";
    }
    else if (currentButtonValue == buttonValues.TEN) {
        autoRefreshButtonOFF.style.display = "none";
        window.onload = timedRefresh(10000);
    }
    else {
        currentButtonValue = buttonValues.OFF;
    }

    autoRefreshButtonOFF.addEventListener('click', function (e) {

        currentButtonValue = onAutoRefresh(autoRefreshButtonOFF, autoRefreshButtonTEN, buttonValues, currentButtonValue);
    });

    autoRefreshButtonTEN.addEventListener('click', function (e) {

        currentButtonValue = onAutoRefresh(autoRefreshButtonOFF, autoRefreshButtonTEN, buttonValues, currentButtonValue);
    });

}

function timedRefresh(timeoutPeriod) {
    setTimeout("location.reload(true);", timeoutPeriod);
}

function createGuardButtons(map, locations) {

    var guardButtons = [];

    for (i = 0; i < locations.length; i++) {

        let location = locations[i];
        let guardButton = parent.document.getElementById(location.GuardID);

        if (guardButton != null || guardButton != undefined) {

            guardButton.addEventListener('click', function (e) {

                map.setCenter({
                    lat: location.lat,
                    lng: location.lng
                });
            })

            guardButtons.push(guardButton);
        }
    }

}

function createIncidentButtons(map, incidents) {

    var incidentButtons = [];

    console.log('logging incidents inside createIncidentButtons');
    console.log(incidents);

    for (i = 0; i < incidents.length; i++) {
        let incident = incidents[i];
        let incidentButton = parent.document.getElementById(incident.IncidentID);


        incidentButton.addEventListener('click', function (e) {

            console.log('incident listener called');

            map.setCenter({
                lat: incident.lat,
                lng: incident.lng
            });
        })

        incidentButtons.push(incidentButton);


    }

}

function createGuardMarkers(locations, map, iconsBase) {
    for (i = 0; i < locations.length; i++) {

        ////////////////////////////DO INFO BOX STUFF HERE////////////////////////////////        
        var windowString =
            `
        <h5 style="color:#D20202">`  + locations[i].FirstName + `</h5>`;

        let markerWindow = new google.maps.InfoWindow({
            content: windowString
        });


        console.log("here's a guard locations");
        console.log(locations[i]);
        var lat = locations[i].lat;
        var lng = locations[i].lng;
        let marker = new google.maps.Marker({
            position: { lat: lat, lng: lng },
            map: map,
            animation: google.maps.Animation.DROP,
        });

        markerWindow.open(map, marker);
        marker.addListener('click', function (e) {
            markerWindow.open(map, marker);
        });


    }
}

function createIncidentMarkers(incidents, map, iconsBase) {

    for (i = 0; i < incidents.length; i++) {
        var lat = incidents[i].lat;
        var lng = incidents[i].lng;

        console.log("logging IncidentID");
        console.log(incidents[i].IncidentID);


        ////////////////////////////DO INFO BOX STUFF HERE////////////////////////////////        
        var windowString =
            `
        <h5 style="color:#D20202">`  + incidents[i].Type + `</h5>
        <h6 style="color:#404040"> 
        ` + incidents[i].Description + `
        </h6>
        <a href = "http://ec2-34-210-155-178.us-west-2.compute.amazonaws.com:3000/incidentdetails/`
            + incidents[i].IncidentID +
            `"><img id ="incidentImage" src="https://s3-us-west-2.amazonaws.com/foxwatch/`
            + incidents[i].IncidentID + `"height="120" width="120" onerror="imageError()" ></a> `

        let markerWindow = new google.maps.InfoWindow({
            content: windowString
        });


        ////////////////////////////DO INFO BOX STUFF HERE////////////////////////////////

        let marker = new google.maps.Marker({
            position: { lat: lat, lng: lng },
            map: map,
            icon: iconsBase + "kml/pal3/icon59.png",
            animation: google.maps.Animation.BOUNCE,
        });
        markerWindow.open(map, marker);
        marker.addListener('click', function (e) {
            markerWindow.open(map, marker);
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

    var removeCheckpointButton = parent.document.getElementById("removeCheckpointButton");

    removeCheckpointButton.addEventListener('click', function (e) {

        onRemoveCheckpoint(route, routeMarkers);
    });


    map.addListener('click', function (e) {
        onSetCheckpoint(route, e.latLng, map, iconsBase, routeMarkers);
    });

    var saveRouteButton = parent.document.getElementById("saveRouteButton");

    saveRouteButton.addEventListener('click', function (e) {

        onSaveRoute(route);
    });

    onLoadRoute(map, iconsBase, route, routeMarkers);

    var loadRouteButton = parent.document.getElementById("loadRouteButton");

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

    xhr.open("POST", "http://ec2-34-210-155-178.us-west-2.compute.amazonaws.com:3000/routes", true);

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

        xhr.open("POST", "http://ec2-34-210-155-178.us-west-2.compute.amazonaws.com:3000/checkpoints", true);

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

    xhr.open("GET", "http://ec2-34-210-155-178.us-west-2.compute.amazonaws.com:3000/currentroutes", true);

    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send(null);



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

    xhr.open("GET", "http://ec2-34-210-155-178.us-west-2.compute.amazonaws.com:3000/checkpoints/" + routeID, true);

    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send(null);
}

function loadRoutesOnMap(checkpoints, map, iconsBase, route, routeMarkers) {


    route.setPath([]);
    for (i = 0; i < routeMarkers.length; i++) {
        routeMarkers[i].setMap(null);
    }
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

function onAutoRefresh(autoRefreshButtonOFF, autoRefreshButtonTEN, buttonValues, currentButtonValue) {


    if (currentButtonValue == buttonValues.OFF) {
        currentButtonValue = buttonValues.TEN;
        autoRefreshButtonOFF.style.display = "none";
        autoRefreshButtonTEN.style.display = "inline";
        localStorage.setItem("currentButtonValue", currentButtonValue);
        window.onload = timedRefresh(10000);


    } else if (currentButtonValue == buttonValues.TEN) {
        currentButtonValue = buttonValues.OFF;
        autoRefreshButtonOFF.style.display = "inline";
        autoRefreshButtonTEN.style.display = "none";
        localStorage.setItem("currentButtonValue", currentButtonValue);

    }

    return currentButtonValue;


}

function openMarker() {

}




//