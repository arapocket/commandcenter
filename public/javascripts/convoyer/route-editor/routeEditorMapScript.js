
function initMap() {



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
        onAddRoute(route);
    });

    cancelRouteButton.addEventListener('click', function (e) {
        onCancelRoute(map, route);
    });

    clearCheckpointsButton.addEventListener('click', function (e) {
        onClearCheckpoints(route);
    })

    removeLastCheckpointButton.addEventListener('click', function (e) {
        onRemoveLastCheckpoint(route)
    });

    saveRouteButton.addEventListener('click', function (e) {
        onSaveRouteAll(route, map)
    });

    loadRouteButton.addEventListener('click', function (e) {
        // onSelectRoute(route, map);
    });



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

    function onAddRoute(route) {

        hideAddButton();

        map.addListener('click', function (e) {
            onAddCheckpoint(route, e.latLng, map);
        });

        google.maps.event.addListener(route, 'click', function (e) {
            onAddCheckpoint(route, e.latLng, map);
        });

        showCancelButton(map, route);
        showClearCheckpointsButton();
        showRemoveLastCheckpointButton();
        showSaveRouteButton();
        showLoadRouteButton();

    }

    function onEditRoute(route, trashRouteButton, clearCheckpointsButton, removeLastCheckpointButton, saveRouteButton, loadRouteButton, map, locations) {



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
            onAddCheckpoint(route, e.latLng, map);
        });

        google.maps.event.addListener(route, 'click', function (e) {
            onAddCheckpoint(route, e.latLng, map);
        });



    }

    function onTrashRoute(map, route, id) {
        
        console.log('logging id from onTrashRoute ' + id);


        google.maps.event.clearListeners(map, 'click');
        google.maps.event.clearListeners(route, 'click');

        // route.setMap(null);
        // route.setPath([]);
        // route.setMap(map);

        loadRoute(map, route, id);

    }

    function onCancelRoute(map, route) {

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

    function onSaveRouteAll(route, map) {

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

    function onSelectRoute(map, route) {
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

                        routeButtons.push({
                            label: label,
                            className: buttonClass,
                            callback: function () {
                                loadSelectedRoute(label, map, route)
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

    function loadSelectedRoute(routeName, map, route) {

        console.log('loadSelectedRoute called');


        var xhr = new XMLHttpRequest();

        if (!xhr) {
            alert('Giving up :( Cannot create an XMLHTTP instance');
            return false;
        }

        xhr.onreadystatechange = function () {
            if (xhr.readyState == XMLHttpRequest.DONE) {
                let json = JSON.parse(xhr.responseText);
                if (json.length > 0) {
                    let routeID = json[0].RouteID;
                    setCurrentRoute(json[0], map, route);
                    loadCurrentRoute(json[0].RouteID, map, route);
                }
            }
        }

        let cleanName = routeName.replace(/[^a-zA-Z0-9]/g, "");

        console.log('logging cleanName after regex ' + cleanName)

        xhr.open("GET", "http://ec2-34-210-155-178.us-west-2.compute.amazonaws.com:3000/selectedroute/" + cleanName, true);

        xhr.send(null);
    }

    function loadRoute(map, route, id) {

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
                    loadCurrentRoute(routeID, map, route);
                }


            }
        }

        xhr.open("GET", "http://ec2-34-210-155-178.us-west-2.compute.amazonaws.com:3000/currentroutes/" + id, true);

        xhr.send(null);

        socket.emit('load route');

    }

    function setCurrentRoute(routeData, map, route) {

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
        } catch(e) {

        }
        

        onTrashRoute(map, route, id);


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

    function loadCurrentRoute(routeID, map, route) {

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
                loadRouteOnMap(checkpoints, map, route);

            }
        }

        xhr.open("GET", "http://ec2-34-210-155-178.us-west-2.compute.amazonaws.com:3000/checkpoints/" + routeID, true);

        xhr.send(null);
    }

    
    function loadRouteOnMap(checkpoints, map, route) {

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
