function renderIncidentPreview() {


    if (incident[0].Media == 'none') {

    }


    if (incident[0].Media == 'photo') {
        var imageAnchor = document.getElementById('imageAnchor');
        imageAnchor.href = "http://ec2-34-210-155-178.us-west-2.compute.amazonaws.com:3000/incidentdetails/" + incident[0].IncidentID
        var incidentPhoto = document.getElementById("incidentPhoto");
        incidentPhoto.src = "https://s3-us-west-2.amazonaws.com/foxwatch/" + incident[0].IncidentID;
        incidentPhoto.style.display = 'block';

    }


    if (incident[0].Media == 'video') {
        var videoAnchor = document.getElementById('videoAnchor');
        videoAnchor.href = "http://ec2-34-210-155-178.us-west-2.compute.amazonaws.com:3000/incidentdetails/" + incident[0].IncidentID
        var incidentVideo = document.getElementById('incidentVideo');
        incidentVideo.src = "https://s3-us-west-2.amazonaws.com/foxwatch/" + incident[0].IncidentID;
        incidentVideo.style.display = 'block';

    }
}

