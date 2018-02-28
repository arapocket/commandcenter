
function initMap() {

    let center = { lat: results[0].lat, lng: results[0].lng };

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
    
    }
    