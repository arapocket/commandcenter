var db=require('../dbconnection'); //reference of dbconnection.js
 
var Route={
 
getAllRoutes:function(callback){
 
return db.query("Select * from Route",callback);
 
},
 getRouteByID:function(id,callback){
 
return db.query("select * from Route where RouteID=?",[id],callback);
 },
 addRoute:function(Route,callback){
 return db.query("Insert into Route values(?,?)",[Route.RouteID, Route.RouteName],callback);
 },
 deleteRoute:function(id,callback){
  return db.query("delete from Route where RouteID=?",[id],callback);
 },
 updateRoute:function(id,route,callback){
  return db.query("update Route set RouteName=?where RouteID=?",[Route.RouteName, RouteID],callback);
 }
 
};
 module.exports=Route;

 