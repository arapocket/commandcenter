'use strict';

function initMap() {

    var currentArea = area[0];

    var center = { lat: currentArea.lat, lng: currentArea.lng };

    var alreadyCalled = false;

    var socket = io();

    var COLORS = ['#e21400', '#f8a700', '#f78b00', '#58dc00', '#a8f07a', '#4ae8c4', '#3b88eb'];

    var iconsBase = "http://maps.google.com/mapfiles/";

    socket.on('incident', function (incident) {
        createIncidentMarker(incident);
        window.setTimeout(function () {
            parent.location.reload();
        }, 3000);
    });

    socket.on('first location', function (incident) {
        window.setTimeout(function () {
            parent.location.reload();
        }, 2000);
    });

    socket.on('user left', function (incident) {

        window.setTimeout(function () {
            parent.location.reload();
        }, 1000);
    });

    if (locations.length > 0) {

        var firstLocationLat = locations[0].lat;
        var firstLocationLng = locations[0].lng;

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
            rotateControl: false
        });

        createGuards();
    } else {

        if (incidents.length > 0) {
            center = { lat: incidents[0].lat, lng: incidents[0].lng };
        }

        var map = new google.maps.Map(document.getElementById('map'), {
            zoom: 18,
            center: center,
            mapTypeId: google.maps.MapTypeId.MAP,
            streetViewControl: false,
            clickableIcons: false,
            fullscreenControl: false,
            mapTypeControl: true,
            panControl: false,
            rotateControl: false
        });
    }

    createIncidentMarkers();
    createIncidentButtons();

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
        strokeColor: "black",
        strokeOpacity: 1,
        strokeWeight: 5,
        icons: [routeSeq]
    });

    var addRouteButton = parent.document.getElementById("addRouteButton");
    var cancelRouteButton = parent.document.getElementById('cancelRouteButton');
    var clearCheckpointsButton = parent.document.getElementById('clearCheckpointsButton');
    var removeLastCheckpointButton = parent.document.getElementById('removeLastCheckpointButton');
    var saveRouteButton = parent.document.getElementById('saveRouteButton');
    var loadRouteButton = parent.document.getElementById('loadRouteButton');

    addRouteButton.addEventListener('click', function (e) {
        onAddRoute();
    });

    cancelRouteButton.addEventListener('click', function (e) {
        onCancelRoute();
    });

    clearCheckpointsButton.addEventListener('click', function (e) {
        onClearCheckpoints(route);
    });

    removeLastCheckpointButton.addEventListener('click', function (e) {
        onRemoveLastCheckpoint(route);
    });

    saveRouteButton.addEventListener('click', function (e) {
        onSaveRouteAll();
    });

    loadRouteButton.addEventListener('click', function (e) {
        onSelectRoute();
    });

    function createGuards() {
        var _loop = function _loop(i) {

            var location = locations[i];
            var id = location.GuardID;
            var firstName = location.FirstName;

            var routeColor = getRouteColor(firstName);

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
                strokeColor: routeColor,
                strokeOpacity: 1,
                strokeWeight: 5,
                icons: [routeSeq]
            });

            google.maps.event.addListener(route, 'click', function (e) {
                onAddCheckpoint(route, e.latLng);
            });

            var clearCheckpointsButton = parent.document.getElementById("clearCheckpointsButton" + id);

            var removeLastCheckpointButton = parent.document.getElementById("removeLastCheckpointButton" + id);

            var saveRouteButton = parent.document.getElementById("saveRouteButton" + id);

            var loadRouteButton = parent.document.getElementById("loadRouteButton" + id);

            var editRouteButton = parent.document.getElementById('editRouteButton' + id);

            var trashRouteButton = parent.document.getElementById('trashRouteButton' + id);

            var endPatrolButton = parent.document.getElementById('endPatrolButton' + id);

            var addRouteButton = parent.document.getElementById('addRouteButton');

            try {
                editRouteButton.addEventListener('click', function (e) {
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
                });

                removeLastCheckpointButton.addEventListener('click', function (e) {
                    onRemoveLastCheckpoint(route);
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
            } catch (err) {}

            var guardButton = parent.document.getElementById(id);

            if (guardButton != null || guardButton != undefined) {

                var lat = location.lat;
                var lng = location.lng;

                socket.on('location ' + id, function (location) {

                    lat = location.location.coords.latitude;
                    lng = location.location.coords.longitude;
                });

                guardButton.addEventListener('click', function (e) {
                    localStorage.setItem("currentGuard", id);

                    localStorage.setItem("alreadyOpenedWindow " + id, true);

                    map.setCenter({
                        lat: lat,
                        lng: lng
                    });

                    changeButtons(location.GuardID, locations, route);
                });
            }

            loadRoute(route, id);

            createGuardMarker(location, locations, route, id);

            createPatrolPath(location, coords, id);
        };

        for (var i = 0; i < locations.length; i++) {
            _loop(i);
        }
    }

    function createPatrolPath(location, coords, id) {

        var firstName = location.FirstName;

        var pathColor = getPathColor(firstName);

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
        });

        for (var i = 0; i < coords.length; i++) {
            if (coords[i].PatrolID == location.PatrolID) {
                var latLng = new google.maps.LatLng(coords[i].lat, coords[i].lng);
                if (i > 0) {
                    var lastLocation = new google.maps.LatLng(coords[i - 1].lat, coords[i - 1].lng);

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

        socket.on('location ' + id, function (location) {

            continuePath(patrol, location);
        });
    }

    function continuePath(patrol, location) {

        var lat = location.location.coords.latitude;
        var lng = location.location.coords.longitude;

        patrol.getPath().push(new google.maps.LatLng(lat, lng));
    }

    function changeButtons(GuardID, locations, route) {

        hideAddButton();
        hideCancelButton();
        hideRemoveLastCheckpointButton();
        hideClearCheckpointsButton();
        hideLoadRouteButton();
        hideSaveRouteButton();

        for (var i = 0; i < locations.length; i++) {
            var id = locations[i].GuardID;

            var hideTrashButton = parent.document.getElementById('trashRouteButton' + id);
            var _hideAddButton = parent.document.getElementById('editRouteButton' + id);
            var hideClearButton = parent.document.getElementById('clearCheckpointsButton' + id);
            var hideRemoveButton = parent.document.getElementById('removeLastCheckpointButton' + id);
            var hideSaveButton = parent.document.getElementById('saveRouteButton' + id);
            var hideLoadButton = parent.document.getElementById('loadRouteButton' + id);
            var hidePatrolButton = parent.document.getElementById('endPatrolButton' + id);

            hideTrashButton.style.display = 'none';
            _hideAddButton.style.display = 'none';
            hideClearButton.style.display = 'none';
            hideRemoveButton.style.display = 'none';
            hideSaveButton.style.display = 'none';
            hideLoadButton.style.display = 'none';
            hidePatrolButton.style.display = 'none';
        }

        var trashRouteButton = parent.document.getElementById('trashRouteButton' + GuardID);
        var editRouteButton = parent.document.getElementById('editRouteButton' + GuardID);
        var clearCheckpointsButton = parent.document.getElementById("clearCheckpointsButton" + id);
        var removeLastCheckpointButton = parent.document.getElementById('removeLastCheckpointButton' + GuardID);
        var saveRouteButton = parent.document.getElementById('saveRouteButton' + GuardID);
        var loadRouteButton = parent.document.getElementById('loadRouteButton' + GuardID);
        var endPatrolButton = parent.document.getElementById('endPatrolButton' + GuardID);

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

    function createIncidentButtons() {

        var incidentButtons = [];

        var _loop2 = function _loop2(i) {
            var incident = incidents[i];
            var incidentButton = parent.document.getElementById(incident.IncidentID);
            var incidentID = incidents[i].IncidentID;

            incidentButton.addEventListener('click', function (e) {

                localStorage.setItem("alreadyOpenedWindow " + incidentID, true);
                map.setCenter({
                    lat: incident.lat,
                    lng: incident.lng
                });
            });

            incidentButtons.push(incidentButton);
        };

        for (var i = 0; i < incidents.length; i++) {
            _loop2(i);
        }
    }

    function createGuardMarker(location, locations, route, id) {

        var windowString = '\n        <h5 style="color:#D20202">' + location.FirstName + '</h5>';

        var markerWindow = new google.maps.InfoWindow({
            content: windowString,
            disableAutoPan: true
        });

        var lat = location.lat;
        var lng = location.lng;
        var marker = new google.maps.Marker({
            position: { lat: lat, lng: lng },
            map: map,
            animation: google.maps.Animation.DROP
        });

        var alreadyOpenedWindow = localStorage.getItem('alreadyOpenedWindow ' + id);
        if (!alreadyOpenedWindow) {
            markerWindow.open(map, marker);
        }

        marker.addListener('click', function (e) {
            localStorage.setItem("alreadyOpenedWindow " + id, true);
            markerWindow.open(map, marker);
            changeButtons(id, locations, route);
        });

        socket.on('location ' + id, function (location) {

            var lat = location.location.coords.latitude;
            var lng = location.location.coords.longitude;
            marker.setPosition(new google.maps.LatLng(lat, lng));
        });
    }

    function createIncidentMarkers() {
        var _loop3 = function _loop3(i) {
            lat = incidents[i].lat;
            lng = incidents[i].lng;

            var incidentID = incidents[i].IncidentID;

            var windowString = '';

            if (incidents[i].Media != 'none') {
                windowString = '\n                <h5 style="color:#D20202">' + incidents[i].Type + '</h5>\n                <h6 style="color:#404040"> \n                ' + incidents[i].Description + '\n                </h6> ' + '<object id = \'map\' data=\'http://ec2-34-210-155-178.us-west-2.compute.amazonaws.com:3000/incidentpreview/' + incidents[i].IncidentID + '\' width=\'100%\' height=\'100%\' type=\'text/html\'> <object/> ';
            } else {
                windowString = '\n                <h5 style="color:#D20202">' + incidents[i].Type + '</h5>\n                <h6 style="color:#404040"> \n                ' + incidents[i].Description + '\n                </h6> ';
            }

            var markerWindow = new google.maps.InfoWindow({
                content: windowString,
                maxWidth: 160,
                disableAutoPan: true
            });

            var marker = new google.maps.Marker({
                position: { lat: lat, lng: lng },
                map: map,
                icon: iconsBase + "kml/pal3/icon59.png",
                animation: google.maps.Animation.DROP
            });

            var alreadyOpenedWindow = localStorage.getItem('alreadyOpenedWindow ' + incidentID);

            if (!alreadyOpenedWindow) {
                markerWindow.open(map, marker);
            }

            marker.addListener('click', function (e) {
                localStorage.setItem("alreadyOpenedWindow " + incidentID, true);
                markerWindow.open(map, marker);
            });
        };

        for (var i = 0; i < incidents.length; i++) {
            var lat;
            var lng;

            _loop3(i);
        }
    }

    function createIncidentMarker(incident) {

        var incidentID = incident.incident;

        var xhr = new XMLHttpRequest();

        if (!xhr) {
            alert('Giving up :( Cannot create an XMLHTTP instance');
            return false;
        }

        xhr.onreadystatechange = function () {
            if (xhr.readyState == XMLHttpRequest.DONE) {
                var json = JSON.parse(xhr.responseText);
                if (json.length > 0) {
                    loadIncidentMarker(json);
                }
            }
        };

        xhr.open("GET", "http://ec2-34-210-155-178.us-west-2.compute.amazonaws.com:3000/incidents/" + incidentID, true);

        xhr.send(null);
    }

    function loadIncidentMarker(json) {

        var incident = json[0];

        var lat = incident.lat;
        var lng = incident.lng;

        var windowString = '';

        if (incident.Media != 'none') {
            windowString = '\n            <h5 style="color:#D20202">' + incident.Type + '</h5>\n            <h6 style="color:#404040"> \n            ' + incident.Description + '\n            </h6> ' + '<object id = \'map\' data=\'http://ec2-34-210-155-178.us-west-2.compute.amazonaws.com:3000/incidentpreview/' + incident.IncidentID + '\' width=\'100%\' height=\'100%\' type=\'text/html\'> <object/> ';
        } else {
            windowString = '\n            <h5 style="color:#D20202">' + incident.Type + '</h5>\n            <h6 style="color:#404040"> \n            ' + incident.Description + '\n            </h6> ';
        }

        var markerWindow = new google.maps.InfoWindow({
            content: windowString,
            maxWidth: 160,
            disableAutoPan: true
        });

        var marker = new google.maps.Marker({
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

        route.setPath([]);
    }

    function onRemoveLastCheckpoint(route) {

        route.getPath().pop();
    }

    function onAddRoute() {

        map.addListener('click', function (e) {
            onAddCheckpoint(route, e.latLng);
        });

        google.maps.event.addListener(route, 'click', function (e) {
            onAddCheckpoint(route, e.latLng);
        });

        hideAddButton();
        showCancelButton();
        showClearCheckpointsButton();
        showRemoveLastCheckpointButton();
        showSaveRouteButton();
        showLoadRouteButton();
    }

    function onEditRoute(route, trashRouteButton, clearCheckpointsButton, removeLastCheckpointButton, saveRouteButton, loadRouteButton, locations) {

        for (var i = 0; i < locations.length; i++) {
            var id = locations[i].GuardID;

            var addButton = parent.document.getElementById('editRouteButton' + id);
            var endButton = parent.document.getElementById('endPatrolButton' + id);

            addButton.style.display = 'none';
            endButton.style.display = 'none';
        }

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

        google.maps.event.clearListeners(map, 'click');
        google.maps.event.clearListeners(route, 'click');

        loadRoute(route, id);
    }

    function onCancelRoute() {

        google.maps.event.clearListeners(map, 'click');
        google.maps.event.clearListeners(route, 'click');

        route.setMap(null);
        route.setPath([]);
        route.setMap(map);

        hideCancelButton();
        hideClearCheckpointsButton();
        hideRemoveLastCheckpointButton();
        hideSaveRouteButton();
        hideLoadRouteButton();
        showAddButton();
    }

    function hideAddButton() {
        var addRouteButton = parent.document.getElementById('addRouteButton');
        addRouteButton.style.display = 'none';
    }

    function showAddButton() {
        var addRouteButton = parent.document.getElementById('addRouteButton');
        addRouteButton.style.display = 'block';
    }

    function hideCancelButton() {
        var cancelRouteButton = parent.document.getElementById('cancelRouteButton');
        cancelRouteButton.style.display = 'none';
    }

    function showCancelButton() {
        var cancelRouteButton = parent.document.getElementById('cancelRouteButton');
        cancelRouteButton.style.display = 'block';
    }

    function hideClearCheckpointsButton() {
        var clearCheckpointsButton = parent.document.getElementById('clearCheckpointsButton');
        clearCheckpointsButton.style.display = 'none';
    }

    function showClearCheckpointsButton() {
        var clearCheckpointsButton = parent.document.getElementById('clearCheckpointsButton');
        clearCheckpointsButton.style.display = 'block';
    }

    function hideRemoveLastCheckpointButton() {
        var removeLastCheckpointButton = parent.document.getElementById('removeLastCheckpointButton');
        removeLastCheckpointButton.style.display = 'none';
    }

    function showRemoveLastCheckpointButton() {
        var removeLastCheckpointButton = parent.document.getElementById('removeLastCheckpointButton');
        removeLastCheckpointButton.style.display = 'block';
    }

    function hideSaveRouteButton() {
        var saveRouteButton = parent.document.getElementById('saveRouteButton');
        saveRouteButton.style.display = 'none';
    }

    function showSaveRouteButton() {
        var saveRouteButton = parent.document.getElementById('saveRouteButton');
        saveRouteButton.style.display = 'block';
    }

    function hideLoadRouteButton() {
        var loadRouteButton = parent.document.getElementById('loadRouteButton');
        loadRouteButton.style.display = 'none';
    }

    function showLoadRouteButton() {
        var loadRouteButton = parent.document.getElementById('loadRouteButton');
        loadRouteButton.style.display = 'block';
    }

    function onEndPatrol(id, firstName, endPatrolButton) {

        bootbox.hideAll();

        bootbox.confirm({
            size: "small",
            message: "Are you sure you want to end " + firstName + "'s patrol?",
            callback: function callback(result) {
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
                        "GuardID": id,
                        'PatrolID': ''
                    }));

                    coordPut(id);

                    parent.location.reload();
                } else {}
            }
        });
    }

    function onSaveRoute(route, editRouteButton, trashRouteButton, clearCheckpointsButton, removeLastCheckpointButton, loadRouteButton, saveRouteButton, id) {

        bootbox.hideAll();

        bootbox.prompt("Enter a name for the route.", function (result) {
            if (result === null) {} else {

                var cleanInput = result.replace(/[^a-zA-Z0-9 ]/g, "");

                editRouteButton.style.display = 'none';
                trashRouteButton.style.display = 'none';
                clearCheckpointsButton.style.display = 'none';
                removeLastCheckpointButton.style.display = 'none';
                saveRouteButton.style.display = 'none';
                loadRouteButton.style.display = 'none';
                google.maps.event.clearListeners(map, 'click');
                google.maps.event.clearListeners(route, 'click');

                var currentGuard = localStorage.getItem("currentGuard");

                var routeID = createID();
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

                bootbox.hideAll();

                bootbox.alert('Route has been set as the current route!');
            }
        });
    }

    function onSaveRouteAll() {

        bootbox.hideAll();

        bootbox.prompt("Enter a name for the route.", function (result) {
            if (result === null) {} else {

                var cleanInput = result.replace(/[^a-zA-Z0-9]/g, "");

                google.maps.event.clearListeners(map, 'click');
                google.maps.event.clearListeners(route, 'click');

                var currentGuard = localStorage.getItem("currentGuard");

                var routeID = createID();
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

                hideCancelButton();
                hideClearCheckpointsButton();
                hideRemoveLastCheckpointButton();
                hideSaveRouteButton();
                hideLoadRouteButton();
                showAddButton();

                bootbox.hideAll();

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
                var json = JSON.parse(xhr.responseText);
                if (json.length > 0) {

                    var routeButtons = [];

                    var _loop4 = function _loop4(i) {
                        var label = json[i].RouteName;
                        var buttonClass = 'btn-primary';
                        var routeID = json[i].RouteID;
                        routeButtons.push({
                            label: label,
                            className: buttonClass,
                            callback: function callback() {
                                setCurrentRoute(routeID, route);
                                loadCurrentRoute(routeID, route);
                            }
                        });
                    };

                    for (var i = 0; i < json.length; i++) {
                        _loop4(i);
                    }

                    bootbox.hideAll();

                    var dialog = bootbox.dialog({
                        title: 'Select Route',
                        message: "<p>Select the route you wish to load.</p>",
                        buttons: routeButtons
                    });
                }
            }
        };

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
                var json = JSON.parse(xhr.responseText);
                if (json.length > 0) {
                    var _routeID = json[0].RouteID;
                    loadCurrentRoute(_routeID, route);
                }
            }
        };

        xhr.open("GET", "http://ec2-34-210-155-178.us-west-2.compute.amazonaws.com:3000/currentroutes/" + id, true);

        xhr.send(null);

        socket.emit('load route');
    }

    function setCurrentRoute(routeID, route) {

        var currentGuard = localStorage.getItem("currentGuard");

        var xhr = new XMLHttpRequest();

        if (!xhr) {
            alert('Giving up :( Cannot create an XMLHTTP instance');
            return false;
        }

        xhr.open("PUT", "http://ec2-34-210-155-178.us-west-2.compute.amazonaws.com:3000/setcurrentroute", true);
        xhr.setRequestHeader('Content-Type', 'application/json');

        xhr.send(JSON.stringify({
            "CurrentRoute": 1,
            "NotCurrentRoute": 0,
            "RouteID": routeID,
            "GuardID": currentGuard
        }));

        var id = currentGuard;

        var clearCheckpointsButton = parent.document.getElementById("clearCheckpointsButton" + id);

        var removeLastCheckpointButton = parent.document.getElementById("removeLastCheckpointButton" + id);

        var saveRouteButton = parent.document.getElementById("saveRouteButton" + id);

        var loadRouteButton = parent.document.getElementById("loadRouteButton" + id);

        var editRouteButton = parent.document.getElementById('editRouteButton' + id);

        var trashRouteButton = parent.document.getElementById('trashRouteButton' + id);

        var endPatrolButton = parent.document.getElementById('endPatrolButton' + id);

        try {
            editRouteButton.style.display = 'none';
            trashRouteButton.style.display = 'none';
            clearCheckpointsButton.style.display = 'none';
            removeLastCheckpointButton.style.display = 'none';
            saveRouteButton.style.display = 'none';
            loadRouteButton.style.display = 'none';
            endPatrolButton.style.display = 'none';
        } catch (e) {}

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
        var s = 0;

        var coords = route.getPath().getArray();

        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
            for (var _iterator = coords[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                var latLng = _step.value;

                var checkpointID = createID();

                var xhr = new XMLHttpRequest();

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
        } catch (err) {
            _didIteratorError = true;
            _iteratorError = err;
        } finally {
            try {
                if (!_iteratorNormalCompletion && _iterator.return) {
                    _iterator.return();
                }
            } finally {
                if (_didIteratorError) {
                    throw _iteratorError;
                }
            }
        }
    }

    function loadCurrentRoute(routeID, route) {

        var xhr = new XMLHttpRequest();

        if (!xhr) {
            alert('Giving up :( Cannot create an XMLHTTP instance');
            return false;
        }

        xhr.onreadystatechange = function () {
            if (xhr.readyState == XMLHttpRequest.DONE) {
                var checkpoints = JSON.parse(xhr.responseText);
                loadRouteOnMap(checkpoints, route);
            }
        };

        xhr.open("GET", "http://ec2-34-210-155-178.us-west-2.compute.amazonaws.com:3000/checkpoints/" + routeID, true);

        xhr.send(null);
    }

    function loadRouteOnMap(checkpoints, route) {

        route.setPath([]);

        if (checkpoints.length > 0) {
            for (var i = 0; i < checkpoints.length; i++) {
                var latLng = new google.maps.LatLng(checkpoints[i].lat, checkpoints[i].lng);
                route.getPath().push(latLng);
            }
        }
    }

    function createID() {
        var newID = Math.random().toString(36).substr(2, 9);
        return newID;
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

    function refreshPage(seconds) {

        if (alreadyCalled) {
            return;
        }

        alreadyCalled = true;

        var count = seconds;

        var counter = setInterval(timer, 1000);

        function timer() {
            count = count - 1;
            if (count <= 0) {
                clearInterval(counter);
                parent.location.reload();
            }

            try {
                parent.document.getElementById("refreshtimer").innerHTML = "Refreshing in " + count + " seconds";
            } catch (err) {}
        }
    }
}