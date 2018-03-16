'use strict';

function initMap() {

    var center = { lat: 34.050963, lng: -118.256133 };
    for (var i = 0; i < areas.length; i++) {
        if (areas[i].CurrentArea == 1) {
            center = { lat: areas[i].lat, lng: areas[i].lng };
        }
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

    var markerIsOnMap = false;

    setUpButtonListeners();

    setUpAreaButtons();

    function setUpButtonListeners() {

        var addAreaButton = parent.document.getElementById("addAreaButton");
        var deleteAreaButton = parent.document.getElementById('deleteAreaButton');
        var setCurrentAreaButton = parent.document.getElementById('setCurrentAreaButton');
        var cancelAreaButton = parent.document.getElementById('cancelAreaButton');

        var addRouteButton = parent.document.getElementById("addRouteButton");
        var cancelRouteButton = parent.document.getElementById('cancelRouteButton');
        var clearCheckpointsButton = parent.document.getElementById('clearCheckpointsButton');
        var removeLastCheckpointButton = parent.document.getElementById('removeLastCheckpointButton');
        var saveRouteButton = parent.document.getElementById('saveRouteButton');
        var loadRouteButton = parent.document.getElementById('loadRouteButton');
        var deleteRouteButton = parent.document.getElementById('deleteRouteButton');

        addAreaButton.addEventListener('click', function (e) {
            onAddArea();
        });

        deleteAreaButton.addEventListener('click', function (e) {
            onDeleteArea();
        });

        setCurrentAreaButton.addEventListener('click', function (e) {
            onSetCurrentArea();
        });

        cancelAreaButton.addEventListener('click', function (e) {
            onCancelArea();
        });

        addRouteButton.addEventListener('click', function (e) {
            onAddRoute();
        });

        cancelRouteButton.addEventListener('click', function (e) {
            onCancelRoute();
        });

        clearCheckpointsButton.addEventListener('click', function (e) {
            onClearCheckpoints();
        });

        removeLastCheckpointButton.addEventListener('click', function (e) {
            onRemoveLastCheckpoint();
        });

        saveRouteButton.addEventListener('click', function (e) {
            onSaveRoute();
        });

        loadRouteButton.addEventListener('click', function (e) {
            onSelectRoute();
        });

        deleteRouteButton.addEventListener('click', function (e) {
            onDeleteRoute();
        });
    }

    function setUpAreaButtons() {
        var _loop = function _loop(_i) {

            var area = areas[_i];
            var id = area.AreaID;

            var areaButton = parent.document.getElementById(id);

            if (areaButton != null || areaButton != undefined) {

                var lat = area.lat;
                var lng = area.lng;

                areaButton.addEventListener('click', function (e) {

                    console.log(areaButton.id + ' clicked');

                    map.setCenter({
                        lat: lat,
                        lng: lng
                    });
                });
            }
        };

        for (var _i = 0; _i < areas.length; _i++) {
            _loop(_i);
        }
    }

    function onAddArea() {

        hideAreaAddButton();
        hideRouteAddButton();
        showAreaCancelButton();
        showAreaSaveButton();
        showAreaDeleteButton();
        showSetCurrentAreaButton();

        map.addListener('click', function (e) {
            onAddAreaMarker(e.latLng);
        });
    }

    function onAddAreaMarker(latLng) {

        markerIsOnMap = true;

        google.maps.event.clearListeners(map, 'click');

        var marker = new google.maps.Marker({
            position: latLng,
            map: map,
            animation: google.maps.Animation.DROP
        });

        map.addListener('click', function (e) {
            marker.setPosition(e.latLng);
        });

        var cancelAreaButton = parent.document.getElementById('cancelAreaButton');
        var saveAreaButton = parent.document.getElementById('saveAreaButton');

        cancelAreaButton.addEventListener('click', function (e) {
            google.maps.event.clearListeners(map, 'click');
            marker.setMap(null);
            markerIsOnMap = false;
        });

        saveAreaButton.addEventListener('click', function (e) {

            if (markerIsOnMap) {
                onSaveArea(marker);
            }
        });
    }

    function onSaveArea(marker) {

        var latLng = marker.getPosition();

        bootbox.hideAll();

        bootbox.prompt("Enter a name for the patrol area.", function (result) {
            if (result === null) {} else {

                var cleanInput = result.replace(/[^a-zA-Z0-9 ]/g, "");

                var areaID = createAreaID();
                var xhr = new XMLHttpRequest();

                if (!xhr) {
                    return false;
                }

                xhr.open("POST", "http://ec2-34-210-155-178.us-west-2.compute.amazonaws.com:3000/patrolareas", true);

                xhr.setRequestHeader('Content-Type', 'application/json');
                xhr.send(JSON.stringify({
                    "AreaID": areaID,
                    "AreaName": cleanInput,
                    "CurrentArea": 0,
                    "lat": latLng.lat(),
                    "lng": latLng.lng()
                }));

                hideAreaCancelButton();
                hideAreaSaveButton();
                hideAreaDeleteButton();
                showAreaAddButton();
                showRouteAddButton();

                bootbox.hideAll();
                bootbox.alert('Area has been saved!');

                window.setTimeout(function () {
                    parent.location.reload();
                }, 2000);
            }
        });
    }

    function onDeleteArea() {

        var xhr = new XMLHttpRequest();

        if (!xhr) {
            console.log('Giving up :( Cannot create an XMLHTTP instance');
            return false;
        }

        xhr.onreadystatechange = function () {
            if (xhr.readyState == XMLHttpRequest.DONE) {
                var json = JSON.parse(xhr.responseText);
                if (json.length > 0) {

                    var areaButtons = [];

                    var _loop2 = function _loop2(_i2) {
                        var label = json[_i2].Name;
                        var buttonClass = 'btn-primary';
                        var areaID = json[_i2].AreaID;

                        areaButtons.push({
                            label: label,
                            className: buttonClass,
                            callback: function callback() {
                                deleteSelectedArea(areaID);
                            }
                        });
                    };

                    for (var _i2 = 0; _i2 < json.length; _i2++) {
                        _loop2(_i2);
                    }

                    bootbox.hideAll();

                    var dialog = bootbox.dialog({
                        title: 'Delete Area',
                        message: "<p>Select the area you wish to delete.</p>",
                        buttons: areaButtons
                    });
                }
            }
        };

        xhr.open("GET", "http://ec2-34-210-155-178.us-west-2.compute.amazonaws.com:3000/patrolareas/", true);

        xhr.send(null);
    }

    function onCancelArea() {

        hideAreaCancelButton();
        hideAreaSaveButton();
        hideAreaDeleteButton();
        hideSetCurrentAreaButton();
        showAreaAddButton();
        showRouteAddButton();
    }

    function onSetCurrentArea() {

        var areaButtons = [];

        var _loop3 = function _loop3(_i3) {
            var label = areas[_i3].Name;
            var buttonClass = 'btn-primary';
            var areaID = areas[_i3].AreaID;

            areaButtons.push({
                label: label,
                className: buttonClass,
                callback: function callback() {
                    setSelectedAreaAsCurrent(areaID);
                }
            });
        };

        for (var _i3 = 0; _i3 < areas.length; _i3++) {
            _loop3(_i3);
        }

        bootbox.hideAll();

        var dialog = bootbox.dialog({
            title: 'Select Current Area',
            message: "<p>Set an area for live view to focus on.</p>",
            buttons: areaButtons
        });
    }

    function setSelectedAreaAsCurrent(areaID) {
        var xhr = new XMLHttpRequest();

        if (!xhr) {
            alert('Giving up :( Cannot create an XMLHTTP instance');
            return false;
        }

        xhr.open("PUT", "http://ec2-34-210-155-178.us-west-2.compute.amazonaws.com:3000/patrolareas", true);

        xhr.setRequestHeader('Content-Type', 'application/json');

        xhr.send(JSON.stringify({
            "CurrentArea": 1,
            "NotCurrentArea": 0,
            "AreaID": areaID
        }));

        bootbox.hideAll();

        bootbox.alert('Current area has been set!');
    }

    function onAddRoute() {

        hideRouteAddButton();
        hideAreaAddButton();

        map.addListener('click', function (e) {
            onAddCheckpoint(e.latLng);
        });

        google.maps.event.addListener(route, 'click', function (e) {
            onAddCheckpoint(e.latLng);
        });

        showRouteCancelButton();
        showClearCheckpointsButton();
        showRemoveLastCheckpointButton();
        showRouteSaveButton();
        showRouteLoadButton();
        showRouteDeleteButton();
    }

    function onAddCheckpoint(latLng) {
        route.getPath().push(latLng);
        route.setMap(map);
    }

    function onClearCheckpoints() {

        console.log('onClearCheckpoints called');

        route.setPath([]);
    }

    function onRemoveLastCheckpoint() {

        console.log('onRemoveLastCheckpoint called');

        route.getPath().pop();
    }

    function onSaveRoute() {

        bootbox.hideAll();

        bootbox.prompt("Enter a name for the route.", function (result) {
            if (result === null) {} else {

                var cleanInput = result.replace(/[^a-zA-Z0-9 ]/g, "");

                google.maps.event.clearListeners(map, 'click');
                google.maps.event.clearListeners(route, 'click');

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

                postCheckpoints(routeID);

                google.maps.event.clearListeners(map, 'click');
                google.maps.event.clearListeners(route, 'click');

                route.setMap(null);
                route.setPath([]);
                route.setMap(map);

                hideRouteCancelButton();
                hideClearCheckpointsButton();
                hideRemoveLastCheckpointButton();
                hideRouteSaveButton();
                hideRouteLoadButton();
                hideRouteDeleteButton();
                showRouteAddButton();
                showAreaAddButton();

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

                    var _loop4 = function _loop4(_i4) {
                        var label = json[_i4].RouteName;
                        var routeID = json[_i4].RouteID;
                        var buttonClass = 'btn-primary';

                        routeButtons.push({
                            label: label,
                            className: buttonClass,
                            callback: function callback() {
                                loadCurrentRoute(routeID);
                            }
                        });
                    };

                    for (var _i4 = 0; _i4 < json.length; _i4++) {
                        _loop4(_i4);
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

    function onDeleteRoute() {

        var xhr = new XMLHttpRequest();

        if (!xhr) {
            console.log('Giving up :( Cannot create an XMLHTTP instance');
            return false;
        }

        xhr.onreadystatechange = function () {
            if (xhr.readyState == XMLHttpRequest.DONE) {
                var json = JSON.parse(xhr.responseText);
                if (json.length > 0) {

                    var routeButtons = [];

                    var _loop5 = function _loop5(_i5) {
                        var label = json[_i5].RouteName;
                        var buttonClass = 'btn-primary';
                        var routeID = json[_i5].RouteID;
                        routeButtons.push({
                            label: label,
                            className: buttonClass,
                            callback: function callback() {
                                deleteSelectedRoute(routeID);
                            },
                            onEscape: function onEscape() {}
                        });
                    };

                    for (var _i5 = 0; _i5 < json.length; _i5++) {
                        _loop5(_i5);
                    }
                    bootbox.hideAll();

                    var dialog = bootbox.dialog({
                        title: 'Delete Route',
                        message: "<p>Select the route you wish to delete.</p>",
                        buttons: routeButtons
                    });
                }
            }
        };

        xhr.open("GET", "http://ec2-34-210-155-178.us-west-2.compute.amazonaws.com:3000/routes/", true);

        xhr.send(null);
    }

    function onCancelRoute() {

        google.maps.event.clearListeners(map, 'click');
        google.maps.event.clearListeners(route, 'click');

        route.setMap(null);
        route.setPath([]);
        route.setMap(map);

        hideRouteCancelButton();
        hideClearCheckpointsButton();
        hideRemoveLastCheckpointButton();
        hideRouteSaveButton();
        hideRouteLoadButton();
        hideRouteDeleteButton();
        showRouteAddButton();
        showAreaAddButton();
    }

    function hideAreaAddButton() {
        var addAreaButton = parent.document.getElementById('addAreaButton');
        addAreaButton.style.display = 'none';
    }

    function showAreaAddButton() {
        var addAreaButton = parent.document.getElementById('addAreaButton');
        addAreaButton.style.display = 'block';
    }

    function hideAreaCancelButton() {
        var cancelAreaButton = parent.document.getElementById('cancelAreaButton');
        cancelAreaButton.style.display = 'none';
    }

    function showAreaCancelButton() {
        var cancelAreaButton = parent.document.getElementById('cancelAreaButton');
        cancelAreaButton.style.display = 'block';
    }

    function hideAreaSaveButton() {
        var saveAreaButton = parent.document.getElementById('saveAreaButton');
        saveAreaButton.style.display = 'none';
    }

    function showAreaSaveButton() {
        var saveAreaButton = parent.document.getElementById('saveAreaButton');
        saveAreaButton.style.display = 'block';
    }

    function hideAreaDeleteButton() {
        var deleteAreaButton = parent.document.getElementById('deleteAreaButton');
        deleteAreaButton.style.display = 'none';
    }

    function showAreaDeleteButton() {
        var deleteAreaButton = parent.document.getElementById('deleteAreaButton');
        deleteAreaButton.style.display = 'block';
    }

    function hideSetCurrentAreaButton() {
        var setCurrentAreaButton = parent.document.getElementById('setCurrentAreaButton');
        setCurrentAreaButton.style.display = 'none';
    }

    function showSetCurrentAreaButton() {
        var setCurrentAreaButton = parent.document.getElementById('setCurrentAreaButton');
        setCurrentAreaButton.style.display = 'block';
    }

    function hideRouteAddButton() {
        var addRouteButton = parent.document.getElementById('addRouteButton');
        addRouteButton.style.display = 'none';
    }

    function showRouteAddButton() {
        var addRouteButton = parent.document.getElementById('addRouteButton');
        addRouteButton.style.display = 'block';
    }

    function hideRouteCancelButton() {
        var cancelRouteButton = parent.document.getElementById('cancelRouteButton');
        cancelRouteButton.style.display = 'none';
    }

    function showRouteCancelButton() {
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

    function hideRouteSaveButton() {
        var saveRouteButton = parent.document.getElementById('saveRouteButton');
        saveRouteButton.style.display = 'none';
    }

    function showRouteSaveButton() {
        var saveRouteButton = parent.document.getElementById('saveRouteButton');
        saveRouteButton.style.display = 'block';
    }

    function hideRouteLoadButton() {
        var loadRouteButton = parent.document.getElementById('loadRouteButton');
        loadRouteButton.style.display = 'none';
    }

    function showRouteLoadButton() {
        var loadRouteButton = parent.document.getElementById('loadRouteButton');
        loadRouteButton.style.display = 'block';
    }

    function hideRouteDeleteButton() {
        var deleteRouteButton = parent.document.getElementById('deleteRouteButton');
        deleteRouteButton.style.display = 'none';
    }

    function showRouteDeleteButton() {
        var deleteRouteButton = parent.document.getElementById('deleteRouteButton');
        deleteRouteButton.style.display = 'block';
    }

    function deleteSelectedRoute(routeID) {

        bootbox.hideAll();

        bootbox.confirm({
            size: "small",
            message: "Are you sure you want to delete the route?",
            callback: function callback(result) {
                /* result is a boolean; true = OK, false = Cancel*/
                if (result) {

                    var xhr = new XMLHttpRequest();

                    if (!xhr) {
                        alert('Giving up :( Cannot create an XMLHTTP instance');
                        return false;
                    }

                    xhr.onreadystatechange = function () {
                        if (xhr.readyState == XMLHttpRequest.DONE) {
                            var json = JSON.parse(xhr.responseText);
                            deleteRoute(routeID);
                        }
                    };

                    xhr.open("DELETE", "http://ec2-34-210-155-178.us-west-2.compute.amazonaws.com:3000/checkpoints/" + routeID, true);

                    xhr.send(null);
                } else {}
            }
        });
    }

    function deleteSelectedArea(areaID) {

        bootbox.hideAll();

        bootbox.confirm({
            size: "small",
            message: "Are you sure you want to delete the area?",
            callback: function callback(result) {
                /* result is a boolean; true = OK, false = Cancel*/
                if (result) {

                    var xhr = new XMLHttpRequest();

                    if (!xhr) {
                        return false;
                    }

                    xhr.onreadystatechange = function () {
                        if (xhr.readyState == XMLHttpRequest.DONE) {
                            var json = JSON.parse(xhr.responseText);
                        }
                    };

                    xhr.open("DELETE", "http://ec2-34-210-155-178.us-west-2.compute.amazonaws.com:3000/patrolareas/" + areaID, true);

                    xhr.send(null);

                    bootbox.hideAll();
                    bootbox.alert('Area has been deleted!');
                    window.setTimeout(function () {
                        parent.location.reload();
                    }, 2000);
                } else {}
            }
        });
    }

    function loadRoute() {

        var xhr = new XMLHttpRequest();

        if (!xhr) {
            alert('Giving up :( Cannot create an XMLHTTP instance');
            return false;
        }

        xhr.onreadystatechange = function () {
            if (xhr.readyState == XMLHttpRequest.DONE) {
                console.log('logging currentroutes response: ' + xhr.responseText);
                var json = JSON.parse(xhr.responseText);
                if (json.length > 0) {
                    var _routeID = json[0].RouteID;
                    loadCurrentRoute(_routeID);
                }
            }
        };

        xhr.open("GET", "http://ec2-34-210-155-178.us-west-2.compute.amazonaws.com:3000/currentroutes/" + id, true);

        xhr.send(null);
    }

    function deleteRoute(routeID) {

        var xhr = new XMLHttpRequest();

        if (!xhr) {
            return false;
        }

        xhr.onreadystatechange = function () {
            if (xhr.readyState == XMLHttpRequest.DONE) {
                var json = JSON.parse(xhr.responseText);
            }
        };

        xhr.open("DELETE", "http://ec2-34-210-155-178.us-west-2.compute.amazonaws.com:3000/routes/" + routeID, true);

        xhr.send(null);

        bootbox.hideAll();

        bootbox.alert('Route has been deleted!');

        route.setPath([]);

        hideRouteCancelButton();
        hideClearCheckpointsButton();
        hideRemoveLastCheckpointButton();
        hideRouteSaveButton();
        hideRouteLoadButton();
        hideRouteDeleteButton();
        showRouteAddButton();
        showAreaAddButton();
    }

    function postCheckpoints(routeID) {
        var s = 0;
        console.log("logging route:");
        console.log(route);
        var coords = route.getPath().getArray();
        console.log("logging coords:");
        console.log(coords);
        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
            for (var _iterator = coords[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                var latLng = _step.value;

                var checkpointID = createCheckpointID();

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

    function loadCurrentRoute(routeID) {

        var xhr = new XMLHttpRequest();

        if (!xhr) {
            alert('Giving up :( Cannot create an XMLHTTP instance');
            return false;
        }

        xhr.onreadystatechange = function () {
            if (xhr.readyState == XMLHttpRequest.DONE) {
                console.log('logging checkpoints response: ' + xhr.responseText);
                var checkpoints = JSON.parse(xhr.responseText);
                loadRouteOnMap(checkpoints);
            }
        };

        xhr.open("GET", "http://ec2-34-210-155-178.us-west-2.compute.amazonaws.com:3000/checkpoints/" + routeID, true);

        xhr.send(null);
    }

    function loadRouteOnMap(checkpoints) {

        route.setPath([]);

        if (checkpoints.length > 0) {
            for (var _i6 = 0; _i6 < checkpoints.length; _i6++) {
                var latLng = new google.maps.LatLng(checkpoints[_i6].lat, checkpoints[_i6].lng);
                route.getPath().push(latLng);
            }
        }

        map.setCenter({
            lat: checkpoints[0].lat,
            lng: checkpoints[0].lng
        });
    }

    function createRouteID() {
        var newRouteID = Math.random().toString(36).substr(2, 9);
        return newRouteID;
    }

    function createAreaID() {
        var newAreaID = Math.random().toString(36).substr(2, 9);
        return newAreaID;
    }

    function createCheckpointID() {
        var newCheckpointID = Math.random().toString(36).substr(2, 9);
        return newCheckpointID;
    }
}