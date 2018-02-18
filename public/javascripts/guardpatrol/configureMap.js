
function imageError() {

    console.log('image error called');
    // let incidentImage = document.getElementById('incidentImage');
    // incidentImage.style.display = 'none';

}

function initMap() {

    var socket = io();


    console.log("initMap called");

    var iconsBase = "http://maps.google.com/mapfiles/"

    socket.on('incident', function (incident) {
        createIncidentMarker(incident);
        window.setTimeout(function () {
            parent.location.reload();
        }, 10000);
    });

    socket.on('user joined', function (incident) {
        window.setTimeout(function () {
            parent.location.reload();
        }, 10000);
    });

    socket.on('user left', function (incident) {

        window.setTimeout(function () {
            parent.location.reload();
        }, 10000);


    });


    if (locations.length > 0) {

        console.log('logging locations');
        console.log(locations);
        console.log('logging locations[0]');
        console.log(locations[0]);

        let firstLocationLat = locations[0].lat;
        let firstLocationLng = locations[0].lng;

        if (incidents.length > 0) {
            firstLocationLat = incidents[0].lat;
            firstLocationLng = incidents[0].lng;
        }

        var map = new google.maps.Map(document.getElementById('map'), {
            zoom: 18,
            center: { lat: firstLocationLat, lng: firstLocationLng },
            mapTypeId: google.maps.MapTypeId.MAP,
            streetViewControl: false,
            clickableIcons: false,
            fullscreenControl: false,
            mapTypeControl: true,
            panControl: false,
            rotateControl: false,


        });

        createIncidentMarkers(incidents, map, iconsBase);

        createGuards(map, locations, coords);

        createIncidentButtons(map, incidents);


    } else {

        var map = new google.maps.Map(document.getElementById('map'), {
            zoom: 18,
            center: { lat: 34.050963, lng: -118.256133 },
            mapTypeId: google.maps.MapTypeId.MAP,
            streetViewControl: false,
            clickableIcons: false,
            fullscreenControl: false,
            mapTypeControl: true,
            panControl: false,
            rotateControl: false,
        });

        // 34.050963, -118.256133
        // var mapSpace = document.getElementById('map');
        // mapSpace.innerHTML = '<object width="100%" height="100%" data="/locationerror.html"></object>';
    }

    function createGuards(map, locations, coords) {

        var guardButtons = [];

        for (let i = 0; i < locations.length; i++) {

            console.log('looping once');

            let location = locations[i];
            let id = location.GuardID;
            let firstName = location.FirstName;


            let routeSeq = {
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
            let route = new google.maps.Polyline({
                map: map,
                zIndex: 1,
                geodesic: true,
                strokeColor: "red",
                strokeOpacity: 1,
                strokeWeight: 5,
                icons: [routeSeq]
            })

            google.maps.event.addListener(route, 'click', function (e) {
                onAddCheckpoint(route, e.latLng, map);
            });

            let clearCheckpointsButton = parent.document.getElementById("clearCheckpointsButton" + id);

            let removeLastCheckpointButton = parent.document.getElementById("removeLastCheckpointButton" + id);

            let saveRouteButton = parent.document.getElementById("saveRouteButton" + id);

            let loadRouteButton = parent.document.getElementById("loadRouteButton" + id);

            let addRouteButton = parent.document.getElementById('addRouteButton' + id);

            let trashRouteButton = parent.document.getElementById('trashRouteButton' + id);

            let endPatrolButton = parent.document.getElementById('endPatrolButton' + id)


            addRouteButton.addEventListener('click', function (e) {
                console.log('the guard id is: ' + id);
                onAddRoute(route, trashRouteButton, clearCheckpointsButton, removeLastCheckpointButton, saveRouteButton, loadRouteButton, map, locations);
            });

            trashRouteButton.addEventListener('click', function (e) {
                onTrashRoute(addRouteButton, trashRouteButton, clearCheckpointsButton, removeLastCheckpointButton, saveRouteButton, loadRouteButton, endPatrolButton, map, route, id);
            });

            clearCheckpointsButton.addEventListener('click', function (e) {
                onClearCheckpoints(route);
            })

            removeLastCheckpointButton.addEventListener('click', function (e) {
                onRemoveLastCheckpoint(route)
            });

            loadRouteButton.addEventListener('click', function (e) {
                let path = route.getPath().getArray();

                if (path.length > 0) {
                    let firstCheckpoint = path[0];
                    console.log('logging firstCheckpoint ' + firstCheckpoint);
                    map.setCenter(firstCheckpoint);
                }


                // onLoadRoute(map, route, id);
                onSelectRoute();
            });

            saveRouteButton.addEventListener('click', function (e) {
                onSaveRoute(route, addRouteButton, trashRouteButton, clearCheckpointsButton, removeLastCheckpointButton, loadRouteButton, saveRouteButton, map, id);
            });

            endPatrolButton.addEventListener('click', function (e) {
                onEndPatrol(id, firstName, endPatrolButton);
            });


            let guardButton = parent.document.getElementById(id);

            if (guardButton != null || guardButton != undefined) {

                let lat = location.lat;
                let lng = location.lng;

                socket.on('location ' + id, function (location) {

                    lat = location.location.coords.latitude;
                    lng = location.location.coords.longitude;
                });

                guardButton.addEventListener('click', function (e) {

                    console.log(guardButton.id + ' clicked');

                    map.setCenter({
                        lat: lat,
                        lng: lng
                    });

                    changeButtons(location.GuardID, locations, map, route);

                    localStorage.setItem("currentGuard", id);
                })

                guardButtons.push(guardButton);
            }

            onLoadRoute(map, route, id);

            createGuardMarker(location, locations, map, route, id);

            createPatrolPath(location, map, coords, id);
        }
    }

    function createPatrolPath(location, map, coords, id) {

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
            strokeWeight: 3,
            icons: [patrolSeq]
        })


        for (let i = 0; i < coords.length; i++) {
            if (coords[i].PatrolID == location.PatrolID) {
                let latLng = new google.maps.LatLng(coords[i].lat, coords[i].lng);
                if (i > 0) {
                    let lastLocation = new google.maps.LatLng(coords[i - 1].lat, coords[i - 1].lng);
                    console.log(latLng.lat());
                    console.log(lastLocation.lat());
                    let locAccurate = locationIsAccurate(latLng, lastLocation);
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

        socket.on('location ' + id, function (location) {
            console.log('location heard from configureMap()');
            console.log(location);
            continuePath(patrol, location);
        });



    }

    function continuePath(patrol, location) {

        // console.log('continue path called');

        // console.log(location.location.coords);

        let lat = location.location.coords.latitude;
        let lng = location.location.coords.longitude;

        patrol.getPath().push(new google.maps.LatLng(lat, lng));
    }

    function changeButtons(GuardID, locations, map, route) {

        for (let i = 0; i < locations.length; i++) {
            var id = locations[i].GuardID;

            let hideTrashButton = parent.document.getElementById('trashRouteButton' + id);
            let hideAddButton = parent.document.getElementById('addRouteButton' + id);
            let hideClearButton = parent.document.getElementById('clearCheckpointsButton' + id)
            let hideRemoveButton = parent.document.getElementById('removeLastCheckpointButton' + id);
            let hideSaveButton = parent.document.getElementById('saveRouteButton' + id);
            let hideLoadButton = parent.document.getElementById('loadRouteButton' + id);
            let hidePatrolButton = parent.document.getElementById('endPatrolButton' + id);

            hideTrashButton.style.display = 'none';
            hideAddButton.style.display = 'none';
            hideClearButton.style.display = 'none';
            hideRemoveButton.style.display = 'none';
            hideSaveButton.style.display = 'none';
            hideLoadButton.style.display = 'none';
            hidePatrolButton.style.display = 'none';

        }

        let trashRouteButton = parent.document.getElementById('trashRouteButton' + GuardID);
        let addRouteButton = parent.document.getElementById('addRouteButton' + GuardID);
        let clearCheckpointsButton = parent.document.getElementById("clearCheckpointsButton" + id);
        let removeLastCheckpointButton = parent.document.getElementById('removeLastCheckpointButton' + GuardID);
        let saveRouteButton = parent.document.getElementById('saveRouteButton' + GuardID);
        let loadRouteButton = parent.document.getElementById('loadRouteButton' + GuardID);
        let endPatrolButton = parent.document.getElementById('endPatrolButton' + GuardID)

        onTrashRoute(addRouteButton, trashRouteButton, clearCheckpointsButton, removeLastCheckpointButton, saveRouteButton, loadRouteButton, endPatrolButton, map, route, GuardID);

        addRouteButton.style.display = 'block';
        endPatrolButton.style.display = 'block';

    }

    function createIncidentButtons(map, incidents) {

        var incidentButtons = [];

        console.log('logging incidents inside createIncidentButtons');
        console.log(incidents);

        for (let i = 0; i < incidents.length; i++) {
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

    function createGuardMarker(location, locations, map, route, id) {


        var windowString =
            `
        <h5 style="color:#D20202">`  + location.FirstName + `</h5>`;

        let markerWindow = new google.maps.InfoWindow({
            content: windowString,
            disableAutoPan: true
        });


        console.log("here's a guard location");
        console.log(location);
        var lat = location.lat;
        var lng = location.lng;
        let marker = new google.maps.Marker({
            position: { lat: lat, lng: lng },
            map: map,
            animation: google.maps.Animation.DROP,
        });

        markerWindow.open(map, marker);
        marker.addListener('click', function (e) {
            markerWindow.open(map, marker);
            changeButtons(id, locations, map, route);
        });


        socket.on('location ' + id, function (location) {

            let lat = location.location.coords.latitude;
            let lng = location.location.coords.longitude;
            marker.setPosition(new google.maps.LatLng(lat, lng))
        });

    }

    function createIncidentMarkers(incidents, map, iconsBase) {

        for (let i = 0; i < incidents.length; i++) {
            var lat = incidents[i].lat;
            var lng = incidents[i].lng;

            console.log("logging IncidentID");
            console.log(incidents[i].IncidentID);

            let windowString = '';

            if (incidents[i].Media != 'none') {
                windowString = `
                <h5 style="color:#D20202">`  + incidents[i].Type + `</h5>
                <h6 style="color:#404040"> 
                ` + incidents[i].Description + `
                </h6> ` +
                    `<object id = 'map' data='http://ec2-34-210-155-178.us-west-2.compute.amazonaws.com:3000/incidentpreview/` + incidents[i].IncidentID + `' width='100%' height='100%' type='text/html'> <object/> `

            } else {
                windowString = `
                <h5 style="color:#D20202">`  + incidents[i].Type + `</h5>
                <h6 style="color:#404040"> 
                ` + incidents[i].Description + `
                </h6> `
            }

            let markerWindow = new google.maps.InfoWindow({
                content: windowString,
                maxWidth: 160,
                disableAutoPan: true
            });

            let marker = new google.maps.Marker({
                position: { lat: lat, lng: lng },
                map: map,
                icon: iconsBase + "kml/pal3/icon59.png",
                animation: google.maps.Animation.DROP
            });
            markerWindow.open(map, marker);
            marker.addListener('click', function (e) {
                markerWindow.open(map, marker);
            });
        }
    }

    function createIncidentMarker(incident) {

        // console.log('logging incident from createIncidentMarker');
        // console.log(incident);

        let incidentID = incident.incident;

        var xhr = new XMLHttpRequest();

        if (!xhr) {
            alert('Giving up :( Cannot create an XMLHTTP instance');
            return false;
        }

        xhr.onreadystatechange = function () {
            if (xhr.readyState == XMLHttpRequest.DONE) {
                console.log('logging incident GET response: ' + xhr.responseText);
                let json = JSON.parse(xhr.responseText);
                if (json.length > 0) {
                    console.log('logging json from Incident GET');
                    console.log(json);
                    loadIncidentMarker(json);
                }
            }
        }

        xhr.open("GET", "http://ec2-34-210-155-178.us-west-2.compute.amazonaws.com:3000/incidents/" + incidentID, true);

        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.send(null);

    }

    function loadIncidentMarker(json) {

        let incident = json[0];

        var lat = incident.lat;
        var lng = incident.lng;


        let windowString = '';

        if (incident.Media != 'none') {
            windowString = `
            <h5 style="color:#D20202">`  + incident.Type + `</h5>
            <h6 style="color:#404040"> 
            ` + incident.Description + `
            </h6> ` +
                `<object id = 'map' data='http://ec2-34-210-155-178.us-west-2.compute.amazonaws.com:3000/incidentpreview/` + incident.IncidentID + `' width='100%' height='100%' type='text/html'> <object/> `

        } else {
            windowString = `
            <h5 style="color:#D20202">`  + incident.Type + `</h5>
            <h6 style="color:#404040"> 
            ` + incident.Description + `
            </h6> `
        }

        let markerWindow = new google.maps.InfoWindow({
            content: windowString,
            maxWidth: 160,
            disableAutoPan: true
        });

        let marker = new google.maps.Marker({
            position: { lat: lat, lng: lng },
            map: map,
            icon: iconsBase + "kml/pal3/icon59.png",
            animation: google.maps.Animation.DROP
        });
        markerWindow.open(map, marker);
        marker.addListener('click', function (e) {
            markerWindow.open(map, marker);
        });

    }

    function onAddCheckpoint(route, latLng, map) {
        route.getPath().push(latLng);
        route.setMap(map);
    }


    function onClearCheckpoints(route) {

        console.log('onClearCheckpoints called');

        route.setPath([]);
    }


    function onRemoveLastCheckpoint(route) {

        console.log('onRemoveLastCheckpoint called');

        route.getPath().pop();

    }

    function onSaveRoute(route, addRouteButton, trashRouteButton, clearCheckpointsButton, removeLastCheckpointButton, loadRouteButton, saveRouteButton, map, id) {


        bootbox.prompt("Enter a name for the route.", function (result) {
            if (result === null) {

            } else {


                console.log('onSaveRoute called');
                console.log('for this id ' + id);

                addRouteButton.style.display = 'none';
                trashRouteButton.style.display = 'none';
                clearCheckpointsButton.style.display = 'none';
                removeLastCheckpointButton.style.display = 'none';
                saveRouteButton.style.display = 'none';
                loadRouteButton.style.display = 'none';
                google.maps.event.clearListeners(map, 'click');
                google.maps.event.clearListeners(route, 'click');

                var currentGuard = localStorage.getItem("currentGuard");

                var routeID = createRouteID();
                var xhr = new XMLHttpRequest();

                if (!xhr) {
                    alert('Giving up :( Cannot create an XMLHTTP instance');
                    return false;
                }

                xhr.open("POST", "http://ec2-34-210-155-178.us-west-2.compute.amazonaws.com:3000/routes", true);

                xhr.setRequestHeader('Content-Type', 'application/json');
                xhr.send(JSON.stringify({
                    "RouteID": routeID,
                    "RouteName": result,
                    "CurrentRoute": 1,
                    "NotCurrentRoute": 0,
                    "GuardID": currentGuard
                }));

                postCheckpoints(route, routeID);


                socket.emit('load route');
            }
        });



    }

    function onSelectRoute() {
        var xhr = new XMLHttpRequest();

        if (!xhr) {
            alert('Giving up :( Cannot create an XMLHTTP instance');
            return false;
        }

        xhr.onreadystatechange = function () {
            if (xhr.readyState == XMLHttpRequest.DONE) {
                let json = JSON.parse(xhr.responseText);
                if (json.length > 0) {

                    let routeButtons = [];

                    for (i = 0; i < json.length; i++) {
                        let label = json[i].RouteName;
                        let buttonClass = 'btn-primary';
                        let callback = function () {

                        }

                        routeButtons.push({
                            "label": json[0].RouteName,
                            'class': 'btn-primary',
                            'callback': function () {
                            }
                        });

                    }

                    bootbox.dialog("Select Route", [{
                        "label": label,
                        'class': buttonClass,
                        'callback': function () {
                        }
                    }]);


                }
            }
        }

        xhr.open("GET", "http://ec2-34-210-155-178.us-west-2.compute.amazonaws.com:3000/routes/", true);

        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.send(null);






    }

    function onLoadRoute(map, route, id) {

        /*
        TODO: 
        -- create a dialogue popup with radio buttons to choose the guard to load for
        **/

        var xhr = new XMLHttpRequest();

        if (!xhr) {
            alert('Giving up :( Cannot create an XMLHTTP instance');
            return false;
        }

        xhr.onreadystatechange = function () {
            if (xhr.readyState == XMLHttpRequest.DONE) {
                console.log('logging currentroutes response: ' + xhr.responseText);
                let json = JSON.parse(xhr.responseText);
                if (json.length > 0) {
                    let routeID = json[0].RouteID;
                    loadCurrentRoutes(routeID, map, route);
                }


            }
        }

        xhr.open("GET", "http://ec2-34-210-155-178.us-west-2.compute.amazonaws.com:3000/currentroutes/" + id, true);

        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.send(null);


        socket.emit('load route');

    }

    function onAddRoute(route, trashRouteButton, clearCheckpointsButton, removeLastCheckpointButton, saveRouteButton, loadRouteButton, map, locations) {



        for (let i = 0; i < locations.length; i++) {
            var id = locations[i].GuardID;

            var addButton = parent.document.getElementById('addRouteButton' + id);
            var endButton = parent.document.getElementById('endPatrolButton' + id)

            addButton.style.display = 'none';
            endButton.style.display = 'none';


        }

        // addRouteButton.style.display = 'none';
        trashRouteButton.style.display = 'block';
        clearCheckpointsButton.style.display = 'block';
        removeLastCheckpointButton.style.display = 'block';
        saveRouteButton.style.display = 'block';
        loadRouteButton.style.display = 'block';

        map.addListener('click', function (e) {
            onAddCheckpoint(route, e.latLng, map);
        });

        google.maps.event.addListener(route, 'click', function (e) {
            onAddCheckpoint(route, e.latLng, map);
        });



    }

    function onTrashRoute(addRouteButton, trashRouteButton, clearCheckpointsButton, removeLastCheckpointButton, saveRouteButton, loadRouteButton, endPatrolButton, map, route, id) {
        addRouteButton.style.display = 'none';
        trashRouteButton.style.display = 'none';
        clearCheckpointsButton.style.display = 'none';
        removeLastCheckpointButton.style.display = 'none';
        saveRouteButton.style.display = 'none';
        loadRouteButton.style.display = 'none';
        endPatrolButton.style.display = 'none';
        google.maps.event.clearListeners(map, 'click');
        google.maps.event.clearListeners(route, 'click');


        route.setMap(null);
        route.setPath([]);
        route.setMap(map);

        onLoadRoute(map, route, id);

    }

    function onEndPatrol(id, firstName, endPatrolButton) {
        bootbox.confirm({
            size: "small",
            message: "Are you sure you want to end " + firstName + "'s patrol?",
            callback: function (result) {
                /* result is a boolean; true = OK, false = Cancel*/
                if (result) {

                    socket.emit('stop', id);

                    endPatrolButton.style.display = 'none';

                    var xhr = new XMLHttpRequest();

                    if (!xhr) {
                        alert('Giving up :( Cannot create an XMLHTTP instance');
                        return false;
                    }

                    xhr.open("PUT", "http://ec2-34-210-155-178.us-west-2.compute.amazonaws.com:3000/patrols", true);

                    xhr.setRequestHeader('Content-Type', 'application/json');
                    xhr.send(JSON.stringify({
                        "CurrentPatrol": 0,
                        "GuardID": id
                    }));

                    coordPut(id);

                    parent.location.reload();

                } else {

                }
            }
        })
    }

    function coordPut(id) {

        var xhr = new XMLHttpRequest();

        if (!xhr) {
            alert('Giving up :( Cannot create an XMLHTTP instance');
            return false;
        }

        xhr.open("PUT", "http://ec2-34-210-155-178.us-west-2.compute.amazonaws.com:3000/coordinates", true);

        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.send(JSON.stringify({
            "CurrentCoord": 0,
            "GuardID": id
        }));

    }

    function postCheckpoints(route, routeID) {
        let s = 0;
        console.log("logging route:");
        console.log(route);
        let coords = route.getPath().getArray();
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
        bootbox.alert('Route has been saved as the current route!')
    }

    function loadCurrentRoutes(routeID, map, route) {
        var xhr = new XMLHttpRequest();

        if (!xhr) {
            alert('Giving up :( Cannot create an XMLHTTP instance');
            return false;
        }

        xhr.onreadystatechange = function () {
            if (xhr.readyState == XMLHttpRequest.DONE) {
                console.log('logging checkpoints response: ' + xhr.responseText);
                var checkpoints = JSON.parse(xhr.responseText);
                loadRoutesOnMap(checkpoints, map, route);

            }
        }

        xhr.open("GET", "http://ec2-34-210-155-178.us-west-2.compute.amazonaws.com:3000/checkpoints/" + routeID, true);

        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.send(null);
    }

    function loadRoutesOnMap(checkpoints, map, route) {

        route.setPath([]);

        if (checkpoints.length > 0) {
            for (let i = 0; i < checkpoints.length; i++) {
                var latLng = new google.maps.LatLng(checkpoints[i].lat, checkpoints[i].lng);
                route.getPath().push(latLng);
            }

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



}
