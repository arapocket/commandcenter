function renderIncidentPreview(){

    var imageAnchor = document.getElementById('imageAnchor');
    var videoAnchor = document.getElementById('videoAnchor');

    imageAnchor.href  = "http://ec2-34-210-155-178.us-west-2.compute.amazonaws.com:3000/incidentdetails/" + incident[0].IncidentID
    videoAnchor.href  = "http://ec2-34-210-155-178.us-west-2.compute.amazonaws.com:3000/incidentdetails/" + incident[0].IncidentID


    var incidentPhoto = document.getElementById("incidentPhoto");
    var incidentVideo = document.getElementById('incidentVideo');
    incidentPhoto.src = "https://s3-us-west-2.amazonaws.com/foxwatch/" + incident[0].IncidentID;
    incidentPhoto.onerror = function(){
    
    incidentPhoto.style.display = 'none';
    incidentVideo.src = "https://s3-us-west-2.amazonaws.com/foxwatch/" + incident[0].IncidentID;
    incidentVideo.style.display = 'block';

    incidentVideo.onerror = function (){
        console.log('incidentView.onerror called');
        incidentVideo.style.display = 'none';
        document.style.display = 'none';
    }

    
    } 

    }
    
 