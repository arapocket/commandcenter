function incidentDetail(){

    console.log("logging iconsbase");
    console.log(parent.iconsBase);

    var incidentID = parent.incidents[i].IncidentID;
    var pic = document.getElementById("incidentphoto");
    pic.src = "https://s3-us-west-2.amazonaws.com/foxwatch/" + incidentID;

}