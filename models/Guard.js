var db=require('../dbconnection'); //reference of dbconnection.js
 
var Guard={
 
getAllGuards:function(callback){
 
return db.query("Select * from Guard",callback);
 
},
 getGuardByID:function(id,callback){
 
return db.query("select * from guard where GuardID=?",[id],callback);
 },
 addGuard:function(Guard,callback){
 return db.query("Insert into guard values(?,?,?,?)",[Guard.GuardID,Guard.FirstName,Guard.LastName, Guard.OrganizationID],callback);
 },
 deleteGuard:function(id,callback){
  return db.query("delete from Guard where GuardID=?",[id],callback);
 },
 updateGuard:function(id,Guard,callback){
  return db.query("update Guard set FirstName=?,LastName=?, OrganizationID=? where GuardID=?",[Guard.FirstName,Guard.LastName,GuardID],callback);
 }
 
};
 module.exports=Guard;

 