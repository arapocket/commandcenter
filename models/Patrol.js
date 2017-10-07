var db=require('../dbconnection'); //reference of dbconnection.js
 
var Patrol={
 
getAllPatrols:function(callback){
 
return db.query("Select * from patrol",callback);
 
},
 getPatrolByID:function(id,callback){
 
return db.query("select * from patrol where PatrolID=?",[id],callback);
 },
 addPatrol:function(Patrol,callback){
 return db.query("Insert into patrol values(?,?)",[Patrol.PatrolID, Patrol.GuardID],callback);
 },
 deletePatrol:function(id,callback){
  return db.query("delete from patrol where PatrolID=?",[id],callback);
 },
 updatePatrol:function(id,patrol,callback){
  return db.query("update patrol set GuardID=?where PatrolID=?",[Patrol.GuardID, PatrolID],callback);
 }
 
};
 module.exports=Patrol;

 