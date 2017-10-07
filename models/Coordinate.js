var db=require('../dbconnection'); //reference of dbconnection.js
 
var Coordinate={
 
getAllCoordinates:function(callback){
 
return db.query("Select * from Coordinate",callback);
 
},
 getCoordinateByID:function(id,callback){
 
return db.query("select * from Coordinate where PatrolID=? ORDER BY Sequence ASC",[id],callback);
 },
 addCoordinate:function(Coordinate,callback){
 return db.query("Insert into Coordinate values(?,?,?,?,?)",[Coordinate.CoordID, Coordinate.Sequence, Coordinate.lat, Coordinate.lng, Coordinate.PatrolID],callback);
 },
 deleteCoordinate:function(id,callback){
  return db.query("delete from Coordinate where CoordID=?",[id],callback);
 },
 updateCoordinate:function(id,path,callback){
  return db.query("update Coordinate set Sequence=?, lat=?, lng=?, PatrolID=? where CoordID=?",[Coordinate.Sequence, Coordinate.lat, Coordinate.lng, Coordinate.PatrolID],callback);
 }
 
};
 module.exports=Coordinate;

 

 