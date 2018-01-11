function renderIncidentDetails(){
console.log("renderIncidentDetails called");
console.log(incident);
var incidentPhoto = document.getElementById("incidentPhoto");
var backButton = document.getElementById("backButton");
incidentPhoto.src = "https://s3-us-west-2.amazonaws.com/foxwatch/" + incident[0].IncidentID;
incidentPhoto.onerror = function(){
    incidentPhoto.src = 'https://s3-us-west-2.amazonaws.com/foxwatch/error'
}


backButton.addEventListener('click', function (e) {
            backToMap();
        });
}

function backToMap(){

    window.location.href = "http://ec2-34-210-155-178.us-west-2.compute.amazonaws.com:3000/foxmaps";
    
}