
function initMap() {

    let guard = results[0];
    let center = { lat: guard.lat, lng: guard.lng };
    let guardPosition = { lat: guard.lat, lng: guard.lng };
    const COLORS = [
        '#e21400', '#f8a700', '#f78b00',
        '#58dc00', '#a8f07a', '#4ae8c4',
        '#3b88eb'];

    var iconsBase = "http://maps.google.com/mapfiles/"

    let map = new google.maps.Map(document.getElementById('map'), {
        zoom: 18,
        center: center,
        mapTypeId: google.maps.MapTypeId.MAP,
        streetViewControl: false,
        clickableIcons: false,
        fullscreenControl: false,
        mapTypeControl: true,
        panControl: false,
        rotateControl: false,
    });

    let marker = new google.maps.Marker({
        position: guardPosition,
        map: map,
        animation: google.maps.Animation.DROP,
    });


    createPatrolPath();
    createIncidentMarkers();
    createIncidentButtons();

    function createPatrolPath() {

        let firstName = guard.FirstName;

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

        let multiplier = 2;

        for (let i = 0; i < results.length; i++) {
            multiplier++;
            window.setTimeout(function () {
                let latLng = new google.maps.LatLng(results[i].lat, results[i].lng);
                if (i > 0) {
                    let lastLocation = new google.maps.LatLng(results[i - 1].lat, results[i - 1].lng);
                    let locAccurate = locationIsAccurate(latLng, lastLocation);
                    if (locAccurate) {
                        patrol.getPath().push(latLng);
                        marker.setPosition(latLng);
                    } else {
                        patrol.getPath().pop();
                    }
                } else {
                    patrol.getPath().push(latLng);
                    marker.setPosition(latLng);

                }
            }, 250 * multiplier);
        }

    }

    function createIncidentMarkers() {

        for (let i = 0; i < incidents.length; i++) {
            var lat = incidents[i].lat;
            var lng = incidents[i].lng;
            let incidentID = incidents[i].IncidentID;

            let windowString = '';

            if (incidents[i].Media != 'none') {
                windowString = ` 
                <div style="color:#D20202">Incident Type: `  + incidents[i].Type + `</div>
                <div style="color:#fff"> 
                ` + incidents[i].Description + `
                </div> 
                `
//<div><object id = 'map' data='http://ec2-34-210-155-178.us-west-2.compute.amazonaws.com:3000/incidentpreview/` + incidents[i].IncidentID + `' width='100%' height='100%' type='text/html'> <object/> </div> 
            } else {
                windowString = `
                <div style="color:#D20202">Incident Type: `  + incidents[i].Type + `</div>
                <div style="color:#404040"> 
                ` + incidents[i].Description + `
                </div> `
            }

            // let markerWindow = new google.maps.InfoWindow({
            //     content: windowString,
            //     maxWidth: 160,
            //     disableAutoPan: true
            // });




            let marker = new google.maps.Marker({
                position: { lat: lat, lng: lng },
                map: map,
                icon: "../../images/warning.png",
                animation: google.maps.Animation.DROP
            });


            let infoWindow = new SnazzyInfoWindow({
                marker: marker,
                content: windowString,
                backgroundColor: 'black',
                maxWidth: 400,
                shadow: {
                    h: '0px',
                    v: '3px',
                    blur: '6px',
                    spread: '0px',
                    opacity: 0.5,
                    color: '#000'
                },
                border: false
            });

            let alreadyOpenedWindow = localStorage.getItem('alreadyOpenedWindow ' + incidentID);

            if (!alreadyOpenedWindow) {
                infoWindow.open(map, marker);
            }

            marker.addListener('click', function (e) {
                localStorage.setItem("alreadyOpenedWindow " + incidentID, true);
                infoWindow.open(map, marker);
            });
        }
    }

    function createIncidentButtons() {

        var incidentButtons = [];

        for (let i = 0; i < incidents.length; i++) {
            let incident = incidents[i];
            let incidentButton = parent.document.getElementById(incident.IncidentID);
            let incidentID = incidents[i].IncidentID;

            incidentButton.addEventListener('click', function (e) {

                map.setCenter({
                    lat: incident.lat,
                    lng: incident.lng
                });
            })

            incidentButtons.push(incidentButton);
        }

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




}
