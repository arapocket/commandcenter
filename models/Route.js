var db = require('./db');



module.exports.getAllRoutes = function (callback) {

    return db.query("Select * from Route", callback);

}


module.exportsgetRouteByID = function (id, callback) {

    return db.query("select * from route where RouteID=?", [id], callback);
}


module.exports.addRoute = function (Route, callback) {
    return db.query("Insert into route values(?,?,?,?)", [Route.RouteID, Route.FirstName, Route.LastName, Route.OrganizationID], callback);
}

module.exports.deleteRoute = function (id, callback) {
    return db.query("delete from Route where RouteID=?", [id], callback);
}

module.exports.updateRoute = function (id, Route, callback) {
    return db.query("update Route set FirstName=?,LastName=?, OrganizationID=? where RouteID=?", [Route.FirstName, Route.LastName, RouteID], callback);
}




