var db = require('./db');



module.exports.getAllCoordinates = function (callback) {

    return db.query("Select * from Coordinate", callback);

}


module.exportsgetCoordinateByID = function (id, callback) {

    return db.query("select * from coordinate where CoordinateID=?", [id], callback);
}


module.exports.addCoordinate = function (Coordinate, callback) {
    return db.query("Insert into coordinate values(?,?,?,?)", [Coordinate.CoordinateID, Coordinate.FirstName, Coordinate.LastName, Coordinate.OrganizationID], callback);
}

module.exports.deleteCoordinate = function (id, callback) {
    return db.query("delete from Coordinate where CoordinateID=?", [id], callback);
}

module.exports.updateCoordinate = function (id, Coordinate, callback) {
    return db.query("update Coordinate set FirstName=?,LastName=?, OrganizationID=? where CoordinateID=?", [Coordinate.FirstName, Coordinate.LastName, CoordinateID], callback);
}




