var db=require('../dbconnection'); //reference of dbconnection.js
 
var Incident={
 
getAllIncidents:function(callback){
 
return db.query("Select * from Incident",callback);
 
},
 getIncidentByID:function(id,callback){
 
return db.query("select * from Incident where IncidentID=?",[id],callback);
 },
 addIncident:function(Incident,callback){
 return db.query("Insert into Incident values(?,?,?,?,?,?)",[Incident.IncidentID, Incident.Description, Incident.Type, Incident.lat, Incident.lng, Incident.PatrolID],callback);
 },
 deleteIncident:function(id,callback){
  return db.query("delete from Incident where IncidentID=?",[id],callback);
 },
 updateIncident:function(id,Incident,callback){
  return db.query("update Incident set Description=?, Type = ?,lat = ?, lng = ?, patrolID = ?, where IncidentID=?",[Incident.Description, Incident.Type,Incident.lat, Incident.lng, Incident.PatrolID, IncidentID],callback);
 }
 
};
 module.exports=Incident;

 