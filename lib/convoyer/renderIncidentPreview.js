'use strict';

function renderIncidentPreview() {

    console.log('rendering incident media type from renderIncidentPreview');
    console.log(incident[0].Media);

    var imageAnchor = document.getElementById('imageAnchor');
    var videoAnchor = document.getElementById('videoAnchor');
    var incidentPhoto = document.getElementById("incidentPhoto");
    var incidentVideo = document.getElementById('incidentVideo');

    if (incident[0].Media == 'none') {
        console.log('none called');
        incidentPhoto.style.display = 'none';
        incidentVideo.style.display = 'none';
    }

    if (incident[0].Media == 'photo') {

        console.log('photo called');

        imageAnchor.href = "http://ec2-34-210-155-178.us-west-2.compute.amazonaws.com:3000/incidentdetails/" + incident[0].IncidentID;
        incidentPhoto.src = "https://s3-us-west-2.amazonaws.com/foxwatch/" + incident[0].IncidentID;
        incidentPhoto.style.display = 'block';
        incidentVideo.style.display = 'none';
    }

    if (incident[0].Media == 'video') {

        console.log('video called');

        videoAnchor.href = "http://ec2-34-210-155-178.us-west-2.compute.amazonaws.com:3000/incidentdetails/" + incident[0].IncidentID;
        incidentVideo.src = "https://s3-us-west-2.amazonaws.com/foxwatch/" + incident[0].IncidentID;
        incidentVideo.style.display = 'block';
        incidentPhoto.style.display = 'none';
    }
}