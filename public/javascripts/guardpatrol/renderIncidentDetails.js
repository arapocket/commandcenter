function renderIncidentDetails(){

    if (incident[0].Media == 'none') {

    }


    if (incident[0].Media == 'photo') {
        var incidentPhoto = document.getElementById("incidentPhoto");
        incidentPhoto.src = "https://s3-us-west-2.amazonaws.com/foxwatch/" + incident[0].IncidentID;
        incidentPhoto.style.display = 'block';

    }


    if (incident[0].Media == 'video') {
        var incidentVideo = document.getElementById('incidentVideo');
        incidentVideo.src = "https://s3-us-west-2.amazonaws.com/foxwatch/" + incident[0].IncidentID;
        incidentVideo.style.display = 'block';

    }




var backButton = document.getElementById("backButton");

backButton.addEventListener('click', function (e) {
            backToMap();
        });
}

function backToMap(){

    window.location.href = "http://ec2-34-210-155-178.us-west-2.compute.amazonaws.com:3000/foxmaps";
    
}