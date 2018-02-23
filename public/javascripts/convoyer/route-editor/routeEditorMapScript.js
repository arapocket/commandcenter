
function initMap() {



    let map = new google.maps.Map(document.getElementById('map'), {
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

    let areaSaveBoxIsOpen = false;

    setUpButtonListeners();

    function setUpButtonListeners() {


        let addAreaButton = parent.document.getElementById("addAreaButton");
        let deleteAreaButton = parent.document.getElementById('deleteAreaButton');
        let setCurrentAreaButton = parent.document.getElementById('setCurrentAreaButton');
        let cancelAreaButton = parent.document.getElementById('cancelAreaButton');

        let addRouteButton = parent.document.getElementById("addRouteButton");
        let cancelRouteButton = parent.document.getElementById('cancelRouteButton');
        let clearCheckpointsButton = parent.document.getElementById('clearCheckpointsButton');
        let removeLastCheckpointButton = parent.document.getElementById('removeLastCheckpointButton');
        let saveRouteButton = parent.document.getElementById('saveRouteButton');
        let loadRouteButton = parent.document.getElementById('loadRouteButton');
        let deleteRouteButton = parent.document.getElementById('deleteRouteButton');

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
        })

        removeLastCheckpointButton.addEventListener('click', function (e) {
            onRemoveLastCheckpoint()
        });

        saveRouteButton.addEventListener('click', function (e) {
            onSaveRoute()
        });

        loadRouteButton.addEventListener('click', function (e) {
            onSelectRoute();
        });

        deleteRouteButton.addEventListener('click', function (e) {
            onDeleteRoute();
        });

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

        google.maps.event.clearListeners(map, 'click');

        let marker = new google.maps.Marker({
            position: latLng,
            map: map,
            animation: google.maps.Animation.DROP,
        });

        map.addListener('click', function (e) {
            marker.setPosition(e.latLng);
        });

        let cancelAreaButton = parent.document.getElementById('cancelAreaButton');
        let saveAreaButton = parent.document.getElementById('saveAreaButton');

        cancelAreaButton.addEventListener('click', function (e) {
            google.maps.event.clearListeners(map, 'click');
            marker.setMap(null);
        });


        saveAreaButton.addEventListener('click', function (e) {
            onSaveArea(marker)
        });

    }

    function onSaveArea(marker) {

        let latLng = marker.getPosition();

        if (!areaSaveBoxIsOpen){

            areaSaveBoxIsOpen = true;

            bootbox.prompt("Enter a name for the patrol area.", function (result) {
                if (result === null) {
                    areaSaveBoxIsOpen = false;
                } else {
    
    
                    let cleanInput = result.replace(/[^a-zA-Z0-9 ]/g, "");
    
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
    
                    hideAreaCancelButton()
                    hideAreaSaveButton();
                    hideAreaDeleteButton();
                    showAreaAddButton();
                    showRouteAddButton();
    
                    bootbox.alert('Area has been saved!');
    
                    areaSaveBoxIsOpen = false;

                    window.setTimeout(function () {
                        parent.location.reload();
                    }, 2000);
    
    
                }
            });
        }

    }

    function onDeleteArea() {

        var xhr = new XMLHttpRequest();

        if (!xhr) {
            console.log('Giving up :( Cannot create an XMLHTTP instance');
            return false;
        }

        xhr.onreadystatechange = function () {
            if (xhr.readyState == XMLHttpRequest.DONE) {
                let json = JSON.parse(xhr.responseText);
                if (json.length > 0) {

                    let areaButtons = [];
                    for (i = 0; i < json.length; i++) {
                        let label = json[i].AreaName;
                        let buttonClass = 'btn-primary';
                        let areaID = json[i].AreaID;
                        areaButtons.push({
                            label: label,
                            className: buttonClass,
                            callback: function () {
                                deleteSelectedArea(areaID);
                            }
                        });

                    }
                    var dialog = bootbox.dialog({
                        title: 'Delete Area',
                        message: "<p>Select the area you wish to delete.</p>",
                        buttons: areaButtons
                    });


                }
            }
        }

        xhr.open("GET", "http://ec2-34-210-155-178.us-west-2.compute.amazonaws.com:3000/patrolareas/", true);

        xhr.send(null);
    }

    function onCancelArea() {

        hideAreaCancelButton()
        hideAreaSaveButton();
        hideAreaDeleteButton();
        hideSetCurrentAreaButton();
        showAreaAddButton();
        showRouteAddButton();


    }

    function onSetCurrentArea() {
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

        bootbox.prompt("Enter a name for the route.", function (result) {
            if (result === null) {

            } else {


                let cleanInput = result.replace(/[^a-zA-Z0-9 ]/g, "");

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

                hideRouteCancelButton()
                hideClearCheckpointsButton();
                hideRemoveLastCheckpointButton();
                hideRouteSaveButton();
                hideRouteLoadButton();
                hideRouteDeleteButton();
                showRouteAddButton();
                showAreaAddButton();

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
                        let routeID = json[i].RouteID;
                        let buttonClass = 'btn-primary';

                        routeButtons.push({
                            label: label,
                            className: buttonClass,
                            callback: function () {
                                loadCurrentRoute(routeID);
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

    function onDeleteRoute() {

        var xhr = new XMLHttpRequest();

        if (!xhr) {
            console.log('Giving up :( Cannot create an XMLHTTP instance');
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
                        let routeID = json[i].RouteID;
                        routeButtons.push({
                            label: label,
                            className: buttonClass,
                            callback: function () {
                                deleteSelectedRoute(routeID);
                            }
                        });

                    }
                    var dialog = bootbox.dialog({
                        title: 'Delete Route',
                        message: "<p>Select the route you wish to delete.</p>",
                        buttons: routeButtons
                    });


                }
            }
        }

        xhr.open("GET", "http://ec2-34-210-155-178.us-west-2.compute.amazonaws.com:3000/routes/", true);

        xhr.send(null);
    }

    function onCancelRoute() {

        google.maps.event.clearListeners(map, 'click');
        google.maps.event.clearListeners(route, 'click');

        route.setMap(null);
        route.setPath([]);
        route.setMap(map);

        hideRouteCancelButton()
        hideClearCheckpointsButton();
        hideRemoveLastCheckpointButton();
        hideRouteSaveButton();
        hideRouteLoadButton();
        hideRouteDeleteButton();
        showRouteAddButton();
        showAreaAddButton();
    }

    function hideAreaAddButton() {
        let addAreaButton = parent.document.getElementById('addAreaButton');
        addAreaButton.style.display = 'none'
    }

    function showAreaAddButton() {
        let addAreaButton = parent.document.getElementById('addAreaButton');
        addAreaButton.style.display = 'block'
    }

    function hideAreaCancelButton() {
        let cancelAreaButton = parent.document.getElementById('cancelAreaButton');
        cancelAreaButton.style.display = 'none';
    }

    function showAreaCancelButton() {
        let cancelAreaButton = parent.document.getElementById('cancelAreaButton');
        cancelAreaButton.style.display = 'block';


    }

    function hideAreaSaveButton() {
        let saveAreaButton = parent.document.getElementById('saveAreaButton');
        saveAreaButton.style.display = 'none';
    }

    function showAreaSaveButton() {
        let saveAreaButton = parent.document.getElementById('saveAreaButton');
        saveAreaButton.style.display = 'block';
    }

    function hideAreaDeleteButton() {
        let deleteAreaButton = parent.document.getElementById('deleteAreaButton');
        deleteAreaButton.style.display = 'none';
    }

    function showAreaDeleteButton() {
        let deleteAreaButton = parent.document.getElementById('deleteAreaButton');
        deleteAreaButton.style.display = 'block';
    }

    function hideSetCurrentAreaButton() {
        let setCurrentAreaButton = parent.document.getElementById('setCurrentAreaButton');
        setCurrentAreaButton.style.display = 'none';
    }

    function showSetCurrentAreaButton() {
        let setCurrentAreaButton = parent.document.getElementById('setCurrentAreaButton');
        setCurrentAreaButton.style.display = 'block';
    }

    function hideRouteAddButton() {
        let addRouteButton = parent.document.getElementById('addRouteButton');
        addRouteButton.style.display = 'none'
    }

    function showRouteAddButton() {
        let addRouteButton = parent.document.getElementById('addRouteButton');
        addRouteButton.style.display = 'block'
    }

    function hideRouteCancelButton() {
        let cancelRouteButton = parent.document.getElementById('cancelRouteButton');
        cancelRouteButton.style.display = 'none';
    }

    function showRouteCancelButton() {
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

    function hideRouteSaveButton() {
        let saveRouteButton = parent.document.getElementById('saveRouteButton');
        saveRouteButton.style.display = 'none';
    }

    function showRouteSaveButton() {
        let saveRouteButton = parent.document.getElementById('saveRouteButton');
        saveRouteButton.style.display = 'block';
    }

    function hideRouteLoadButton() {
        let loadRouteButton = parent.document.getElementById('loadRouteButton');
        loadRouteButton.style.display = 'none';
    }

    function showRouteLoadButton() {
        let loadRouteButton = parent.document.getElementById('loadRouteButton');
        loadRouteButton.style.display = 'block';
    }

    function hideRouteDeleteButton() {
        let deleteRouteButton = parent.document.getElementById('deleteRouteButton');
        deleteRouteButton.style.display = 'none';
    }

    function showRouteDeleteButton() {
        let deleteRouteButton = parent.document.getElementById('deleteRouteButton');
        deleteRouteButton.style.display = 'block';
    }

    function deleteSelectedRoute(routeID) {

        bootbox.confirm({
            size: "small",
            message: "Are you sure you want to delete the route?",
            callback: function (result) {
                /* result is a boolean; true = OK, false = Cancel*/
                if (result) {

                    var xhr = new XMLHttpRequest();

                    if (!xhr) {
                        alert('Giving up :( Cannot create an XMLHTTP instance');
                        return false;
                    }

                    xhr.onreadystatechange = function () {
                        if (xhr.readyState == XMLHttpRequest.DONE) {
                            let json = JSON.parse(xhr.responseText);
                            deleteRoute(routeID);

                        }
                    }

                    xhr.open("DELETE", "http://ec2-34-210-155-178.us-west-2.compute.amazonaws.com:3000/checkpoints/" + routeID, true);

                    xhr.send(null);

                } else {

                }
            }
        })


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
                let json = JSON.parse(xhr.responseText);
                if (json.length > 0) {
                    let routeID = json[0].RouteID;
                    loadCurrentRoute(routeID);
                }


            }
        }

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
                let json = JSON.parse(xhr.responseText);
            }
        }

        xhr.open("DELETE", "http://ec2-34-210-155-178.us-west-2.compute.amazonaws.com:3000/routes/" + routeID, true);

        xhr.send(null);

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
        }

        xhr.open("GET", "http://ec2-34-210-155-178.us-west-2.compute.amazonaws.com:3000/checkpoints/" + routeID, true);

        xhr.send(null);
    }

    function loadRouteOnMap(checkpoints) {

        route.setPath([]);

        if (checkpoints.length > 0) {
            for (let i = 0; i < checkpoints.length; i++) {
                var latLng = new google.maps.LatLng(checkpoints[i].lat, checkpoints[i].lng);
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
