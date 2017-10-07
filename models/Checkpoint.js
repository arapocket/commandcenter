var db=require('../dbconnection'); //reference of dbconnection.js
 
var Checkpoint={
 
getAllCheckpoints:function(callback){
 
return db.query("Select * from Checkpoint",callback);
 
},
 getCheckpointByID:function(id,callback){
 
return db.query("select * from Checkpoint where RouteID=? ORDER BY Sequence ASC",[id],callback);
 },
 addCheckpoint:function(Checkpoint,callback){
 return db.query("Insert into Checkpoint values(?,?,?,?,?)",[Checkpoint.CheckpointID, Checkpoint.Sequence, Checkpoint.lat, Checkpoint.lng, Checkpoint.RouteID],callback);
 },
 deleteCheckpoint:function(id,callback){
  return db.query("delete from Checkpoint where RouteID=?",[id],callback);
 },
 updateCheckpoint:function(id,path,callback){
  return db.query("update Checkpoint set Sequence=?, lat=?, lng=?, RouteID=? where CheckpointID=?",[Checkpoint.Sequence, Checkpoint.lat, Checkpoint.lng,  Checkpoint.RouteID],callback);
 }
 
};
 module.exports=Checkpoint;

 