
function initMap() {

    let incident = results[0];

    let center = { lat: incident.lat, lng: incident.lng };

    var mapStyle = [{ 'featureType': 'administrative', 'elementType': 'labels.text.fill', 'stylers': [{ 'color': '#444444' }] }, { 'featureType': 'landscape', 'elementType': 'all', 'stylers': [{ 'color': '#f2f2f2' }] }, { 'featureType': 'poi', 'elementType': 'all', 'stylers': [{ 'visibility': 'off' }] }, { 'featureType': 'road', 'elementType': 'all', 'stylers': [{ 'saturation': -100 }, { 'lightness': 45 }] }, { 'featureType': 'road.highway', 'elementType': 'all', 'stylers': [{ 'visibility': 'simplified' }] }, { 'featureType': 'road.arterial', 'elementType': 'labels.icon', 'stylers': [{ 'visibility': 'off' }] }, { 'featureType': 'transit', 'elementType': 'all', 'stylers': [{ 'visibility': 'off' }] }, { 'featureType': 'water', 'elementType': 'all', 'stylers': [{ 'color': '#4f595d' }, { 'visibility': 'on' }] }];

    let map = new google.maps.Map(document.getElementById('map'), {
        styles: mapStyle,
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
        position: center,
        map: map,
        animation: google.maps.Animation.DROP,
        icon: "../../images/warning.png",
    });

    createIncidentMarker();

    function createIncidentMarker() {


        let incidentID = incident.IncidentID;

        // let windowString = '';

        // if (incident.Media != 'none') {
        //     windowString = `<h3  style="text-align: center">` + incident.Type + ` </h3> 
        //             <div style="text-align: center"> <p>` + incident.Description + `</p> </div> <div text-align = 'center'> <object id = 'map' data='http://ec2-54-187-16-98.us-west-2.compute.amazonaws.com:3000/incidentpreview/` + incident.IncidentID + `' width='100%' height='100%' type='text/html'> <object/> </div>
        //             `;
        // } else {
        //     windowString = `<h3  style="text-align: center">` + incident.Type + ` </h3> 
        //         <div style="text-align: center"> <p>` + incident.Description + `</p></div>`
        // }


        // let infoWindow = new SnazzyInfoWindow({
        //     marker: marker,
        //     content: windowString
        // });

        // infoWindow.open(map, marker);


        // marker.addListener('click', function (e) {
        //     infoWindow.open(map, marker);
        // });

    }

}
