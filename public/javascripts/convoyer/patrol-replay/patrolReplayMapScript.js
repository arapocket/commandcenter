
function initMap() {

    let center = { lat: 34.050963, lng: -118.256133 };

    
    
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
    