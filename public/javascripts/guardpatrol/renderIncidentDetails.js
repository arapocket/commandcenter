function renderIncidentDetails(){
console.log("renderIncidentDetails called");

var incidentPhoto = document.getElementById("incidentPhoto");

incidentPhoto.src = "https://s3-us-west-2.amazonaws.com/foxwatch/" + incident.IncidentID;

}