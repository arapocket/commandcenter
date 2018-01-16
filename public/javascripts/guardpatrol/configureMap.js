
function imageError() {

    console.log('image error called');
    // let incidentImage = document.getElementById('incidentImage');
    // incidentImage.style.display = 'none';

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

        // addRouteButtonListeners(map, iconsBase, locations);

        createGuardMarkers(locations, map, iconsBase);

        createIncidentMarkers(incidents, map, iconsBase);

        createPatrolPaths(patrols, coords, map);

        createGuardButtons(map, locations, iconsBase);

        createIncidentButtons(map, incidents);

        setRefreshButtonListeners();

    } else {
        var mapSpace = document.getElementById('map');
        mapSpace.innerHTML = '<object width="100%" height="100%" data="/locationerror.html"></object>';
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

    function createGuardButtons(map, locations, iconsBase) {

        var guardButtons = [];

        for (i = 0; i < locations.length; i++) {

            let id = locations[i].GuardID;


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
                onAddCheckpoint(route, e.latLng, map, iconsBase);
            });


            let GuardID = locations[i].GuardID;

            let removeCheckpointButton = parent.document.getElementById("removeCheckpointButton" + GuardID);

            let saveRouteButton = parent.document.getElementById("saveRouteButton" + GuardID);

            let loadRouteButton = parent.document.getElementById("loadRouteButton" + GuardID);

            let addRouteButton = parent.document.getElementById('addRouteButton' + GuardID);

            let trashRouteButton = parent.document.getElementById('trashRouteButton' + GuardID);

            let endPatrolButton = parent.document.getElementById('endPatrolButton' + GuardID)



            addRouteButton.addEventListener('click', function (e) {
                console.log('the guardid is: ' + GuardID);
                onAddRoute(route, iconsBase, trashRouteButton, addRouteButton, removeCheckpointButton, saveRouteButton, loadRouteButton, map, locations);
            });

            trashRouteButton.addEventListener('click', function (e) {
                onTrashRoute(addRouteButton, trashRouteButton, removeCheckpointButton, saveRouteButton, loadRouteButton, endPatrolButton, map, iconsBase, route, id);
            });

            removeCheckpointButton.addEventListener('click', function (e) {
                onRemoveCheckpoint(route)
            });

            loadRouteButton.addEventListener('click', function (e) {

                onLoadRoute(map, iconsBase, route, id);
            });

            saveRouteButton.addEventListener('click', function (e) {

                onSaveRoute(route, addRouteButton, trashRouteButton, removeCheckpointButton, loadRouteButton, saveRouteButton, map);
            });

            endPatrolButton.addEventListener('click', function (e) {
                onEndPatrol(id);
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

                    changeButtons(location.GuardID, locations, map, iconsBase, route);

                    localStorage.setItem("currentGuard", location.GuardID);
                })

                guardButtons.push(guardButton);
            }

            onLoadRoute(map, iconsBase, route, id);

        }


    }

    function changeButtons(GuardID, locations, map, iconsBase, route) {



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

        onTrashRoute(addRouteButton, trashRouteButton, removeCheckpointButton, saveRouteButton, loadRouteButton, endPatrolButton, map, iconsBase, route, GuardID);

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
            var windowString = `
        <h5 style="color:#D20202">`  + incidents[i].Type + `</h5>
        <h6 style="color:#404040"> 
        ` + incidents[i].Description + `
        </h6> ` +
                `<object id = 'map' data='http://ec2-34-210-155-178.us-west-2.compute.amazonaws.com:3000/incidentpreview/` + incidents[i].IncidentID + `' width='100%' height='100%' type='text/html'> <object/> `



            // <a href = "http://ec2-34-210-155-178.us-west-2.compute.amazonaws.com:3000/incidentdetails/`
            //     + incidents[i].IncidentID +
            //     `"><img id ="incidentImage" src="https://s3-us-west-2.amazonaws.com/foxwatch/`
            //     + incidents[i].IncidentID + `"height="120" width="120" onerror="imageError()" ></a> `

            let markerWindow = new google.maps.InfoWindow({
                content: windowString,
                maxWidth: 160
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

    function onAddCheckpoint(route, latLng, map, iconsBase) {
        route.getPath().push(latLng);
        route.setMap(map);
    }

    function onRemoveCheckpoint(route) {

        console.log('onRemoveCheckpoint called');

        route.getPath().pop();

    }

    function onSaveRoute(route, addRouteButton, trashRouteButton, removeCheckpointButton, loadRouteButton, saveRouteButton, map) {

        /*
        TODO: 
        -- create a dialogue popup with radio buttons to choose the guard to save for
        **/

        addRouteButton.style.display = 'none';
        trashRouteButton.style.display = 'none';
        removeCheckpointButton.style.display = 'none';
        saveRouteButton.style.display = 'none';
        loadRouteButton.style.display = 'none';
        google.maps.event.clearListeners(map, 'click');

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


    }

    function onLoadRoute(map, iconsBase, route, id) {

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
                    loadCurrentRoutes(routeID, map, iconsBase, route);
                }


            }
        }

        xhr.open("GET", "http://ec2-34-210-155-178.us-west-2.compute.amazonaws.com:3000/currentroutes/" + id, true);

        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.send(null);



    }

    function onAddRoute(route, iconsBase, trashRouteButton, addRouteButton, removeCheckpointButton, saveRouteButton, loadRouteButton, map, locations) {



        for (i = 0; i < locations.length; i++) {
            var id = locations[i].GuardID;

            var addButton = parent.document.getElementById('addRouteButton' + id);
            addButton.style.display = 'none';

        }

        // addRouteButton.style.display = 'none';
        trashRouteButton.style.display = 'block';
        removeCheckpointButton.style.display = 'block';
        saveRouteButton.style.display = 'block';
        loadRouteButton.style.display = 'block';

        map.addListener('click', function (e) {
            onAddCheckpoint(route, e.latLng, map, iconsBase);
        });

    }

    function onTrashRoute(addRouteButton, trashRouteButton, removeCheckpointButton, saveRouteButton, loadRouteButton, endPatrolButton, map, iconsBase, route, id) {
        addRouteButton.style.display = 'none';
        trashRouteButton.style.display = 'none';
        removeCheckpointButton.style.display = 'none';
        saveRouteButton.style.display = 'none';
        loadRouteButton.style.display = 'none';
        endPatrolButton.style.display = 'none';
        google.maps.event.clearListeners(map, 'click');


        route.setMap(null);
        route.setPath([]);
        route.setMap(map);

        onLoadRoute(map, iconsBase, route, id);

    }

    function onEndPatrol(id){

        var xhr = new XMLHttpRequest();

        if (!xhr) {
            alert('Giving up :( Cannot create an XMLHTTP instance');
            return false;
        } else {
            coordPut(id);
        }

        xhr.open("PUT", "http://ec2-34-210-155-178.us-west-2.compute.amazonaws.com:3000/patrols", true);

        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.send(JSON.stringify({
            "CurrentPatrol": 0,
            "GuardID": id
        }));

    }

    function coordPut(id){

        var xhr = new XMLHttpRequest();

        if (!xhr) {
            alert('Giving up :( Cannot create an XMLHTTP instance');
            return false;
        }

        xhr.open("PUT", "http://ec2-34-210-155-178.us-west-2.compute.amazonaws.com:3000/patrols", true);

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


    function loadCurrentRoutes(routeID, map, iconsBase, route) {
        var xhr = new XMLHttpRequest();

        if (!xhr) {
            alert('Giving up :( Cannot create an XMLHTTP instance');
            return false;
        }

        xhr.onreadystatechange = function () {
            if (xhr.readyState == XMLHttpRequest.DONE) {
                console.log('logging checkpoints response: ' + xhr.responseText);
                var checkpoints = JSON.parse(xhr.responseText);
                loadRoutesOnMap(checkpoints, map, iconsBase, route);

            }
        }

        xhr.open("GET", "http://ec2-34-210-155-178.us-west-2.compute.amazonaws.com:3000/checkpoints/" + routeID, true);

        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.send(null);
    }

    function loadRoutesOnMap(checkpoints, map, iconsBase, route) {


        for (i = 0; i < checkpoints.length; i++) {
            var latLng = new google.maps.LatLng(checkpoints[i].lat, checkpoints[i].lng);
            route.getPath().push(latLng);
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