
function imageError() {

    console.log('image error called');
    // let incidentImage = document.getElementById('incidentImage');
    // incidentImage.style.display = 'none';

}

function initMap() {

    var socket = io();


    console.log("initMap called");

    var iconsBase = "http://maps.google.com/mapfiles/"

    setRefreshButtonListeners();

    if (locations.length > 0) {

        console.log('logging locations[0]');
        console.log(locations[0]);
        
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

        createIncidentMarkers(incidents, map, iconsBase);

        createPatrolPaths(patrols, coords, map);

        createGuards(map, locations);

        createIncidentButtons(map, incidents);


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
        });



        socket.on('location', function (location) {
            console.log('location heard from configureMap()');
            console.log(location);
            continuePath(patrol, location);
          });
    

    } else {
        var mapSpace = document.getElementById('map');
        mapSpace.innerHTML = '<object width="100%" height="100%" data="/locationerror.html"></object>';
    }

    function continuePath(patrol, location) {

        console.log('continue path called');

        console.log(location.coords);

        let lat = JSON.stringify(location.coords.latitude);
        let lng = JSON.stringify(location.coords.longitude);

        patrol.getPath().push({
            lat: lat,
            lng: lng
        });
    }

    function setRefreshButtonListeners() {

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
            autoRefreshButtonTEN.style.display = "none";
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

    function createGuards(map, locations) {

        var guardButtons = [];

        for (i = 0; i < locations.length; i++) {

            let id = locations[i].GuardID;
            let firstName = locations[i].FirstName;


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
                strokeColor: "#26e9f7",
                strokeOpacity: 1,
                strokeWeight: 7,
                icons: [routeSeq]
            })

            google.maps.event.addListener(route, 'click', function (e) {
                onAddCheckpoint(route, e.latLng, map);
            });


            let GuardID = locations[i].GuardID;

            let removeCheckpointButton = parent.document.getElementById("removeCheckpointButton" + GuardID);

            let saveRouteButton = parent.document.getElementById("saveRouteButton" + GuardID);

            let loadRouteButton = parent.document.getElementById("loadRouteButton" + GuardID);

            let addRouteButton = parent.document.getElementById('addRouteButton' + GuardID);

            let trashRouteButton = parent.document.getElementById('trashRouteButton' + GuardID);

            let endPatrolButton = parent.document.getElementById('endPatrolButton' + GuardID)



            addRouteButton.addEventListener('click', function (e) {
                console.log('the guard id is: ' + GuardID);
                onAddRoute(route, trashRouteButton, removeCheckpointButton, saveRouteButton, loadRouteButton, map, locations);
            });

            trashRouteButton.addEventListener('click', function (e) {
                onTrashRoute(addRouteButton, trashRouteButton, removeCheckpointButton, saveRouteButton, loadRouteButton, endPatrolButton, map, route, id);
            });

            removeCheckpointButton.addEventListener('click', function (e) {
                onRemoveCheckpoint(route)
            });

            loadRouteButton.addEventListener('click', function (e) {
                let path = route.getPath().getArray();

                if (path.length > 0) {
                    let firstCheckpoint = path[0];
                    console.log('logging firstCheckpoint ' + firstCheckpoint);
                    map.setCenter(firstCheckpoint);
                }


                onLoadRoute(map, route, id);
            });

            saveRouteButton.addEventListener('click', function (e) {
                onSaveRoute(route, addRouteButton, trashRouteButton, removeCheckpointButton, loadRouteButton, saveRouteButton, map);
            });

            endPatrolButton.addEventListener('click', function (e) {
                onEndPatrol(id, firstName, endPatrolButton);
            });

            let location = locations[i];
            let guardButton = parent.document.getElementById(location.GuardID);

            if (guardButton != null || guardButton != undefined) {

                guardButton.addEventListener('click', function (e) {

                    console.log(guardButton.id + ' clicked');

                    map.setCenter({
                        lat: location.lat,
                        lng: location.lng
                    });

                    changeButtons(location.GuardID, locations, map, route);

                    localStorage.setItem("currentGuard", location.GuardID);
                })

                guardButtons.push(guardButton);
            }

            onLoadRoute(map, route, id);


            createGuardMarker(location, locations, map, route, id);

        }


    }

    function changeButtons(GuardID, locations, map, route) {



        for (i = 0; i < locations.length; i++) {
            var id = locations[i].GuardID;

            let hideTrashButton = parent.document.getElementById('trashRouteButton' + id);
            let hideAddButton = parent.document.getElementById('addRouteButton' + id);
            let hideRemoveButton = parent.document.getElementById('removeCheckpointButton' + id);
            let hideSaveButton = parent.document.getElementById('saveRouteButton' + id);
            let hideLoadButton = parent.document.getElementById('loadRouteButton' + id);
            let hidePatrolButton = parent.document.getElementById('endPatrolButton' + id);

            hideTrashButton.style.display = 'none';
            hideAddButton.style.display = 'none';
            hideRemoveButton.style.display = 'none';
            hideSaveButton.style.display = 'none';
            hideLoadButton.style.display = 'none';
            hidePatrolButton.style.display = 'none';

        }


        let trashRouteButton = parent.document.getElementById('trashRouteButton' + GuardID);
        let addRouteButton = parent.document.getElementById('addRouteButton' + GuardID);
        let removeCheckpointButton = parent.document.getElementById('removeCheckpointButton' + GuardID);
        let saveRouteButton = parent.document.getElementById('saveRouteButton' + GuardID);
        let loadRouteButton = parent.document.getElementById('loadRouteButton' + GuardID);
        let endPatrolButton = parent.document.getElementById('endPatrolButton' + GuardID)

        onTrashRoute(addRouteButton, trashRouteButton, removeCheckpointButton, saveRouteButton, loadRouteButton, endPatrolButton, map, route, GuardID);

        addRouteButton.style.display = 'block';
        endPatrolButton.style.display = 'block';

        // trashRouteButton.style.display = 'block';
        // removeCheckpointButton.style.display = 'block';
        // saveRouteButton.style.display = 'block';
        // loadRouteButton.style.display = 'block';        
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

    function createGuardMarker(location, locations, map, route, id) {


        var windowString =
            `
        <h5 style="color:#D20202">`  + location.FirstName + `</h5>`;

        let markerWindow = new google.maps.InfoWindow({
            content: windowString
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


    }

    function createIncidentMarkers(incidents, map, iconsBase) {

        for (i = 0; i < incidents.length; i++) {
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
                maxWidth: 160
            });

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
        for (p = 0; p < patrols.length; p++) {
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
                if (coords[i].PatrolID == patrols[p].PatrolID) {
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
        }
    }

    function onAddCheckpoint(route, latLng, map) {
        route.getPath().push(latLng);
        route.setMap(map);
    }

    function onRemoveCheckpoint(route) {

        console.log('onRemoveCheckpoint called');

        route.getPath().pop();

    }

    function onSaveRoute(route, addRouteButton, trashRouteButton, removeCheckpointButton, loadRouteButton, saveRouteButton, map) {

        addRouteButton.style.display = 'none';
        trashRouteButton.style.display = 'none';
        removeCheckpointButton.style.display = 'none';
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
            "RouteName": "test",
            "CurrentRoute": 1,
            "NotCurrentRoute": 0,
            "GuardID": currentGuard
        }));

        postCheckpoints(route, routeID);


        socket.emit('load route');

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

    function onAddRoute(route, trashRouteButton, removeCheckpointButton, saveRouteButton, loadRouteButton, map, locations) {



        for (i = 0; i < locations.length; i++) {
            var id = locations[i].GuardID;

            var addButton = parent.document.getElementById('addRouteButton' + id);
            var endButton = parent.document.getElementById('endPatrolButton' + id)

            addButton.style.display = 'none';
            endButton.style.display = 'none';


        }

        // addRouteButton.style.display = 'none';
        trashRouteButton.style.display = 'block';
        removeCheckpointButton.style.display = 'block';
        saveRouteButton.style.display = 'block';
        loadRouteButton.style.display = 'block';

        map.addListener('click', function (e) {
            onAddCheckpoint(route, e.latLng, map);
        });

        google.maps.event.addListener(route, 'click', function (e) {
            onAddCheckpoint(route, e.latLng, map);
        });



    }

    function onTrashRoute(addRouteButton, trashRouteButton, removeCheckpointButton, saveRouteButton, loadRouteButton, endPatrolButton, map, route, id) {
        addRouteButton.style.display = 'none';
        trashRouteButton.style.display = 'none';
        removeCheckpointButton.style.display = 'none';
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
            for (i = 0; i < checkpoints.length; i++) {
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


}
