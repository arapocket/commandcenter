function renderIncidentDetails(){

    let incidentPhoto = document.getElementById("incidentPhoto");
    let incidentVideo = document.getElementById('incidentVideo');

    if (incident[0].Media == 'none') {
        incidentPhoto.style.display = 'none';
        incidentVideo.style.display = 'none';
    }


    if (incident[0].Media == 'photo') {
        
        incidentPhoto.src = "https://s3-us-west-2.amazonaws.com/foxwatch/" + incident[0].IncidentID;
        incidentPhoto.style.display = 'block';
        incidentVideo.style.display = 'none';
    }

    if (incident[0].Media == 'video') {
        
        incidentVideo.src = "https://s3-us-west-2.amazonaws.com/foxwatch/" + incident[0].IncidentID;
        incidentVideo.style.display = 'block';
        incidentPhoto.style.display = 'none';
    }




var backButton = document.getElementById("backButton");

backButton.addEventListener('click', function (e) {
            backToMap();
        });
}

function backToMap(){

    window.location.href = "http://ec2-34-210-155-178.us-west-2.compute.amazonaws.com:3000/foxmaps";
    
}