
function imageError() {

    console.log('image error called');
    // let incidentImage = document.getElementById('incidentImage');
    // incidentImage.style.display = 'none';

}

function initMap() {

    var socket = io();

    const COLORS = [
        '#e21400', '#f8a700', '#f78b00',
        '#58dc00', '#a8f07a', '#4ae8c4',
        '#3b88eb'
    ];


    console.log("initMap called");

    var iconsBase = "http://maps.google.com/mapfiles/"

    socket.on('incident', function (incident) {
        createIncidentMarker(incident);
        window.setTimeout(function () {
            parent.location.reload();
        }, 10000);
    });

    socket.on('first location', function (incident) {
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

        createIncidentMarkers(incidents, iconsBase);

        createGuards(locations, coords);

        createIncidentButtons(incidents);


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
        strokeColor: "black",
        strokeOpacity: 1,
        strokeWeight: 5,
        icons: [routeSeq]
    })

    let addRouteButton = parent.document.getElementById("addRouteButton");
    let cancelRouteButton = parent.document.getElementById('cancelRouteButton');
    let clearCheckpointsButton = parent.document.getElementById('clearCheckpointsButton');
    let removeLastCheckpointButton = parent.document.getElementById('removeLastCheckpointButton');
    let saveRouteButton = parent.document.getElementById('saveRouteButton');
    let loadRouteButton = parent.document.getElementById('loadRouteButton');


    addRouteButton.addEventListener('click', function (e) {
        onAddRoute();
    });

    cancelRouteButton.addEventListener('click', function (e) {
        onCancelRoute();
    });

    clearCheckpointsButton.addEventListener('click', function (e) {
        onClearCheckpoints(route);
    })

    removeLastCheckpointButton.addEventListener('click', function (e) {
        onRemoveLastCheckpoint(route)
    });

    saveRouteButton.addEventListener('click', function (e) {
        onSaveRouteAll()
    });

    loadRouteButton.addEventListener('click', function (e) {
        onSelectRoute();
    });


    function createGuards(locations, coords) {

        var guardButtons = [];

        for (let i = 0; i < locations.length; i++) {

            console.log('looping once');

            let location = locations[i];
            let id = location.GuardID;
            let firstName = location.FirstName;

            let routeColor = getRouteColor(firstName);


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
                strokeColor: routeColor,
                strokeOpacity: 1,
                strokeWeight: 5,
                icons: [routeSeq]
            })

            google.maps.event.addListener(route, 'click', function (e) {
                onAddCheckpoint(route, e.latLng);
            });

            let clearCheckpointsButton = parent.document.getElementById("clearCheckpointsButton" + id);

            let removeLastCheckpointButton = parent.document.getElementById("removeLastCheckpointButton" + id);

            let saveRouteButton = parent.document.getElementById("saveRouteButton" + id);

            let loadRouteButton = parent.document.getElementById("loadRouteButton" + id);

            let editRouteButton = parent.document.getElementById('editRouteButton' + id);

            let trashRouteButton = parent.document.getElementById('trashRouteButton' + id);

            let endPatrolButton = parent.document.getElementById('endPatrolButton' + id)

            let addRouteButton = parent.document.getElementById('addRouteButton')

            editRouteButton.addEventListener('click', function (e) {
                console.log('the guard id is: ' + id);
                onEditRoute(route, trashRouteButton, clearCheckpointsButton, removeLastCheckpointButton, saveRouteButton, loadRouteButton, locations);
            });

            trashRouteButton.addEventListener('click', function (e) {

                editRouteButton.style.display = 'none';
                trashRouteButton.style.display = 'none';
                clearCheckpointsButton.style.display = 'none';
                removeLastCheckpointButton.style.display = 'none';
                saveRouteButton.style.display = 'none';
                loadRouteButton.style.display = 'none';
                endPatrolButton.style.display = 'none';

                onTrashRoute(route, id);
                showAddButton();
            });

            clearCheckpointsButton.addEventListener('click', function (e) {
                onClearCheckpoints(route);
            })

            removeLastCheckpointButton.addEventListener('click', function (e) {
                onRemoveLastCheckpoint(route)
            });

            loadRouteButton.addEventListener('click', function (e) {

                onSelectRoute(route);
            });

            saveRouteButton.addEventListener('click', function (e) {
                onSaveRoute(route, editRouteButton, trashRouteButton, clearCheckpointsButton, removeLastCheckpointButton, loadRouteButton, saveRouteButton, id);
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

                    changeButtons(location.GuardID, locations, route);

                    localStorage.setItem("currentGuard", id);
                })

                guardButtons.push(guardButton);
            }

            loadRoute(route, id);

            createGuardMarker(location, locations, route, id);

            createPatrolPath(location, coords, id);
        }
    }

    function createPatrolPath(location, coords, id) {

        let firstName = location.FirstName;

        let pathColor = getPathColor(firstName);

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
            strokeColor: pathColor,
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
            console.log('location heard from convoyerMapScript()');
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

    function changeButtons(GuardID, locations, route) {

        hideAddButton();
        hideCancelButton();
        hideRemoveLastCheckpointButton();
        hideClearCheckpointsButton();
        hideLoadRouteButton();
        hideSaveRouteButton();

        for (let i = 0; i < locations.length; i++) {
            var id = locations[i].GuardID;

            let hideTrashButton = parent.document.getElementById('trashRouteButton' + id);
            let hideAddButton = parent.document.getElementById('editRouteButton' + id);
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
        let editRouteButton = parent.document.getElementById('editRouteButton' + GuardID);
        let clearCheckpointsButton = parent.document.getElementById("clearCheckpointsButton" + id);
        let removeLastCheckpointButton = parent.document.getElementById('removeLastCheckpointButton' + GuardID);
        let saveRouteButton = parent.document.getElementById('saveRouteButton' + GuardID);
        let loadRouteButton = parent.document.getElementById('loadRouteButton' + GuardID);
        let endPatrolButton = parent.document.getElementById('endPatrolButton' + GuardID)


        editRouteButton.style.display = 'none';
        trashRouteButton.style.display = 'none';
        clearCheckpointsButton.style.display = 'none';
        removeLastCheckpointButton.style.display = 'none';
        saveRouteButton.style.display = 'none';
        loadRouteButton.style.display = 'none';
        endPatrolButton.style.display = 'none';

        onTrashRoute(route, GuardID);

        editRouteButton.style.display = 'block';
        endPatrolButton.style.display = 'block';

    }

    function createIncidentButtons(incidents) {

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

    function createGuardMarker(location, locations, route, id) {


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
            changeButtons(id, locations, route);
        });


        socket.on('location ' + id, function (location) {

            let lat = location.location.coords.latitude;
            let lng = location.location.coords.longitude;
            marker.setPosition(new google.maps.LatLng(lat, lng))
        });

    }

    function createIncidentMarkers(incidents, iconsBase) {

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

    function onAddCheckpoint(route, latLng) {
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

    function onAddRoute() {

        hideAddButton();

        map.addListener('click', function (e) {
            onAddCheckpoint(route, e.latLng);
        });

        google.maps.event.addListener(route, 'click', function (e) {
            onAddCheckpoint(route, e.latLng);
        });

        showCancelButton();
        showClearCheckpointsButton();
        showRemoveLastCheckpointButton();
        showSaveRouteButton();
        showLoadRouteButton();

    }

    function onEditRoute(route, trashRouteButton, clearCheckpointsButton, removeLastCheckpointButton, saveRouteButton, loadRouteButton, locations) {



        for (let i = 0; i < locations.length; i++) {
            var id = locations[i].GuardID;

            var addButton = parent.document.getElementById('editRouteButton' + id);
            var endButton = parent.document.getElementById('endPatrolButton' + id)

            addButton.style.display = 'none';
            endButton.style.display = 'none';


        }

        // editRouteButton.style.display = 'none';
        trashRouteButton.style.display = 'block';
        clearCheckpointsButton.style.display = 'block';
        removeLastCheckpointButton.style.display = 'block';
        saveRouteButton.style.display = 'block';
        loadRouteButton.style.display = 'block';

        map.addListener('click', function (e) {
            onAddCheckpoint(route, e.latLng);
        });

        google.maps.event.addListener(route, 'click', function (e) {
            onAddCheckpoint(route, e.latLng);
        });



    }

    function onTrashRoute(route, id) {

        console.log('logging id from onTrashRoute ' + id);


        google.maps.event.clearListeners(map, 'click');
        google.maps.event.clearListeners(route, 'click');

        // route.setMap(null);
        // route.setPath([]);
        // route.setMap(map);

        loadRoute(route, id);

    }

    function onCancelRoute() {

        google.maps.event.clearListeners(map, 'click');
        google.maps.event.clearListeners(route, 'click');

        route.setMap(null);
        route.setPath([]);
        route.setMap(map);

        hideCancelButton()
        hideClearCheckpointsButton();
        hideRemoveLastCheckpointButton();
        hideSaveRouteButton();
        hideLoadRouteButton();
        showAddButton();
    }

    function hideAddButton() {
        let addRouteButton = parent.document.getElementById('addRouteButton');
        addRouteButton.style.display = 'none'
    }

    function showAddButton() {
        let addRouteButton = parent.document.getElementById('addRouteButton');
        addRouteButton.style.display = 'block'
    }

    function hideCancelButton() {
        let cancelRouteButton = parent.document.getElementById('cancelRouteButton');
        cancelRouteButton.style.display = 'none';
    }

    function showCancelButton() {
        let cancelRouteButton = parent.document.getElementById('cancelRouteButton');
        cancelRouteButton.style.display = 'block';


    }

    function hideClearCheckpointsButton() {
        let clearCheckpointsButton = parent.document.getElementById('clearCheckpointsButton');
        clearCheckpointsButton.style.display = 'none';
    }

    function showClearCheckpointsButton() {
        let clearCheckpointsButton = parent.document.getElementById('clearCheckpointsButton');
        clearCheckpointsButton.style.display = 'block';
    }

    function hideRemoveLastCheckpointButton() {
        let removeLastCheckpointButton = parent.document.getElementById('removeLastCheckpointButton');
        removeLastCheckpointButton.style.display = 'none';
    }

    function showRemoveLastCheckpointButton() {
        let removeLastCheckpointButton = parent.document.getElementById('removeLastCheckpointButton');
        removeLastCheckpointButton.style.display = 'block';
    }

    function hideSaveRouteButton() {
        let saveRouteButton = parent.document.getElementById('saveRouteButton');
        saveRouteButton.style.display = 'none';
    }

    function showSaveRouteButton() {
        let saveRouteButton = parent.document.getElementById('saveRouteButton');
        saveRouteButton.style.display = 'block';
    }

    function hideLoadRouteButton() {
        let loadRouteButton = parent.document.getElementById('loadRouteButton');
        loadRouteButton.style.display = 'none';
    }

    function showLoadRouteButton() {
        let loadRouteButton = parent.document.getElementById('loadRouteButton');
        loadRouteButton.style.display = 'block';
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

    function onSaveRoute(route, editRouteButton, trashRouteButton, clearCheckpointsButton, removeLastCheckpointButton, loadRouteButton, saveRouteButton, id) {


        bootbox.prompt("Enter a name for the route.", function (result) {
            if (result === null) {

            } else {


                let cleanInput = result.replace(/[^a-zA-Z0-9 ]/g, "");


                console.log('onSaveRoute called');
                console.log('for this id ' + id);

                editRouteButton.style.display = 'none';
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
                    "RouteName": cleanInput,
                    "CurrentRoute": 1,
                    "NotCurrentRoute": 0,
                    "GuardID": currentGuard
                }));

                postCheckpoints(route, routeID);

                socket.emit('load route');

                bootbox.alert('Route has been set as the current route!');

            }
        });



    }

    function onSaveRouteAll() {

        bootbox.prompt("Enter a name for the route.", function (result) {
            if (result === null) {

            } else {


                let cleanInput = result.replace(/[^a-zA-Z0-9]/g, "");

                google.maps.event.clearListeners(map, 'click');
                google.maps.event.clearListeners(route, 'click');

                var currentGuard = localStorage.getItem("currentGuard");

                var routeID = createRouteID();
                var xhr = new XMLHttpRequest();

                if (!xhr) {
                    alert('Giving up :( Cannot create an XMLHTTP instance');
                    return false;
                }

                xhr.open("POST", "http://ec2-34-210-155-178.us-west-2.compute.amazonaws.com:3000/saveroute", true);

                xhr.setRequestHeader('Content-Type', 'application/json');
                xhr.send(JSON.stringify({
                    "RouteID": routeID,
                    "RouteName": cleanInput,
                    "CurrentRoute": 1
                }));

                postCheckpoints(route, routeID);

                google.maps.event.clearListeners(map, 'click');
                google.maps.event.clearListeners(route, 'click');

                route.setMap(null);
                route.setPath([]);
                route.setMap(map);

                hideCancelButton()
                hideClearCheckpointsButton();
                hideRemoveLastCheckpointButton();
                hideSaveRouteButton();
                hideLoadRouteButton();
                showAddButton();

                bootbox.alert('Route has been saved for later!');


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
                        let routeID = json[i].RouteID
                        routeButtons.push({
                            label: label,
                            className: buttonClass,
                            callback: function () {
                                setCurrentRoute(routeID, route);
                                loadCurrentRoute(routeID, route);
                            }
                        });

                    }
                    var dialog = bootbox.dialog({
                        title: 'Select Route',
                        message: "<p>Select the route you wish to load.</p>",
                        buttons: routeButtons
                    });


                }
            }
        }

        xhr.open("GET", "http://ec2-34-210-155-178.us-west-2.compute.amazonaws.com:3000/routes/", true);

        xhr.send(null);
    }

    function loadRoute(route, id) {

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
                    loadCurrentRoute(routeID, route);
                }


            }
        }

        xhr.open("GET", "http://ec2-34-210-155-178.us-west-2.compute.amazonaws.com:3000/currentroutes/" + id, true);

        xhr.send(null);

        socket.emit('load route');

    }

    function setCurrentRoute(routeData, route) {

        let currentGuard = localStorage.getItem("currentGuard");

        console.log('logging currentGuard from setCurrentRoute ' + currentGuard);

        let xhr = new XMLHttpRequest();

        if (!xhr) {
            alert('Giving up :( Cannot create an XMLHTTP instance');
            return false;
        }

        xhr.open("PUT", "http://ec2-34-210-155-178.us-west-2.compute.amazonaws.com:3000/setcurrentroute", true);
        xhr.setRequestHeader('Content-Type', 'application/json');


        xhr.send(JSON.stringify({
            "CurrentRoute": 1,
            "NotCurrentRoute": 0,
            "RouteID": routeData.RouteID,
            "GuardID": currentGuard
        }));


        let id = currentGuard;

        let clearCheckpointsButton = parent.document.getElementById("clearCheckpointsButton" + id);

        let removeLastCheckpointButton = parent.document.getElementById("removeLastCheckpointButton" + id);

        let saveRouteButton = parent.document.getElementById("saveRouteButton" + id);

        let loadRouteButton = parent.document.getElementById("loadRouteButton" + id);

        let editRouteButton = parent.document.getElementById('editRouteButton' + id);

        let trashRouteButton = parent.document.getElementById('trashRouteButton' + id);

        let endPatrolButton = parent.document.getElementById('endPatrolButton' + id)

        try {
            editRouteButton.style.display = 'none';
            trashRouteButton.style.display = 'none';
            clearCheckpointsButton.style.display = 'none';
            removeLastCheckpointButton.style.display = 'none';
            saveRouteButton.style.display = 'none';
            loadRouteButton.style.display = 'none';
            endPatrolButton.style.display = 'none';
        } catch (e) {

        }


        onTrashRoute(route, id);


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
    }

    function loadCurrentRoute(routeID, route) {

        console.log('loadCurrentRoute called ');

        var xhr = new XMLHttpRequest();

        if (!xhr) {
            alert('Giving up :( Cannot create an XMLHTTP instance');
            return false;
        }

        xhr.onreadystatechange = function () {
            if (xhr.readyState == XMLHttpRequest.DONE) {
                console.log('logging checkpoints response: ' + xhr.responseText);
                var checkpoints = JSON.parse(xhr.responseText);
                loadRouteOnMap(checkpoints, route);

            }
        }

        xhr.open("GET", "http://ec2-34-210-155-178.us-west-2.compute.amazonaws.com:3000/checkpoints/" + routeID, true);

        xhr.send(null);
    }

    // $%$%
    function loadRouteOnMap(checkpoints, route) {

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

    function getPathColor(username) {
        // Compute hash code
        var hash = 7;
        for (var i = 0; i < username.length; i++) {
            hash = username.charCodeAt(i) + (hash << 5) - hash;
        }
        // Calculate color
        var index = Math.abs(hash % COLORS.length);
        return COLORS[index];
    }

    function getRouteColor(username) {
        // Compute hash code
        var hash = 11;
        for (var i = 0; i < username.length; i++) {
            hash = username.charCodeAt(i) + (hash << 5) - hash;
        }
        // Calculate color
        var index = Math.abs(hash % COLORS.length);
        return COLORS[index];
    }


}