
function initMap() {

    let guard = results[0];
    let center = { lat: guard.lat, lng: guard.lng };

    let guardPosition = {lat: guard.lat, lng: guard.lng};

    const COLORS = [
        '#e21400', '#f8a700', '#f78b00',
        '#58dc00', '#a8f07a', '#4ae8c4',
        '#3b88eb'
    ];

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

    createGuardMarker();

    createPatrolPath();


    function createGuardMarker() {

        let marker = new google.maps.Marker({
            position: guardPosition,
            map: map,
            animation: google.maps.Animation.DROP,
        });
    }

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
                        guardPosition = latLng;
                    } else {
                        patrol.getPath().pop();
                    }
                } else {
                    patrol.getPath().push(latLng);
                    guardPosition = latLng;

                }
            }, 500 * multiplier);
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
