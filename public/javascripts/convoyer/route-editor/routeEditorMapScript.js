
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

    setUpButtonListeners();


    function setUpButtonListeners() {

        let addRouteButton = parent.document.getElementById("addRouteButton");
        let cancelRouteButton = parent.document.getElementById('cancelRouteButton');
        let clearCheckpointsButton = parent.document.getElementById('clearCheckpointsButton');
        let removeLastCheckpointButton = parent.document.getElementById('removeLastCheckpointButton');
        let saveRouteButton = parent.document.getElementById('saveRouteButton');
        let loadRouteButton = parent.document.getElementById('loadRouteButton');
        let deleteRouteButton = parent.document.getElementById('deleteRouteButton');


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
            onSaveRouteAll()
        });

        loadRouteButton.addEventListener('click', function (e) {
            onSelectRoute();
        });

        deleteRouteButton.addEventListener('click', function (e) {
            onDeleteRoute();
        });

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

    function onAddRoute() {

        hideAddButton();

        map.addListener('click', function (e) {
            onAddCheckpoint(e.latLng);
        });

        google.maps.event.addListener(route, 'click', function (e) {
            onAddCheckpoint(e.latLng);
        });

        showCancelButton();
        showClearCheckpointsButton();
        showRemoveLastCheckpointButton();
        showSaveRouteButton();
        showLoadRouteButton();
        showDeleteRouteButton();

    }

    function onTrashRoute() {


        google.maps.event.clearListeners(map, 'click');
        google.maps.event.clearListeners(route, 'click');

        // route.setMap(null);
        // route.setPath([]);
        // route.setMap(map);

        loadRoute();

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
        hideDeleteRouteButton();
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

    function hideDeleteRouteButton() {
        let deleteRouteButton = parent.document.getElementById('deleteRouteButton');
        deleteRouteButton.style.display = 'none';
    }

    function showDeleteRouteButton() {
        let deleteRouteButton = parent.document.getElementById('deleteRouteButton');
        deleteRouteButton.style.display = 'block';
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

                postCheckpoints(routeID);

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
                hideDeleteRouteButton();
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

                        routeButtons.push({
                            label: label,
                            className: buttonClass,
                            callback: function () {
                                loadSelectedRoute(label)
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

    function onDeleteRoute(){
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

                        routeButtons.push({
                            label: label,
                            className: buttonClass,
                            callback: function () {
                                deleteSelectedRoute(label);
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

    function loadSelectedRoute(routeName) {

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
                    loadCurrentRoute(json[0].RouteID);
                }
            }
        }

        let cleanName = routeName.replace(/[^a-zA-Z0-9]/g, "");

        console.log('logging cleanName after regex ' + cleanName)

        xhr.open("GET", "http://ec2-34-210-155-178.us-west-2.compute.amazonaws.com:3000/selectedroute/" + cleanName, true);

        xhr.send(null);
    }

    function deleteSelectedRoute(routeName) {

        console.log('deleteSelectedRoute called');

        var xhr = new XMLHttpRequest();

        if (!xhr) {
            alert('Giving up :( Cannot create an XMLHTTP instance');
            return false;
        }

        xhr.onreadystatechange = function () {
            if (xhr.readyState == XMLHttpRequest.DONE) {
                let json = JSON.parse(xhr.responseText);
            }
        }

        let cleanName = routeName.replace(/[^a-zA-Z0-9]/g, "");

        console.log('logging cleanName after regex ' + cleanName)

        xhr.open("DELETE", "http://ec2-34-210-155-178.us-west-2.compute.amazonaws.com:3000/deleteroute/" + cleanName, true);

        xhr.send(null);
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

        try {
            route.setPath([]);
        }
        catch (err) {
            console.log('catch called ' + err);

        }

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

    function createCheckpointID() {
        var newCheckpointID = Math.random().toString(36).substr(2, 9);
        return newCheckpointID;
    }

}
