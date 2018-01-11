function renderIncidentPreview(){

    var incidentPhoto = document.getElementById("incidentPhoto");
    var incidentVideo = document.getElementById('incidentVideo');
    incidentPhoto.src = "https://s3-us-west-2.amazonaws.com/foxwatch/" + incident[0].IncidentID;
    incidentPhoto.onerror = function(){
    
    incidentPhoto.style.display = 'none';
    incidentVideo.src = "https://s3-us-west-2.amazonaws.com/foxwatch/" + incident[0].IncidentID;
    incidentVideo.style.display = 'block';
    
    } 

    }
    
 