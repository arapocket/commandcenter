var db = require('./db');



module.exports.getAllGuards = function (callback) {

    return db.query("Select * from Guard", callback);

}


module.exportsgetGuardByID = function (id, callback) {

    return db.query("select * from guard where GuardID=?", [id], callback);
}


module.exports.addGuard = function (Guard, callback) {
    return db.query("Insert into guard values(?,?,?,?)", [Guard.GuardID, Guard.FirstName, Guard.LastName, Guard.OrganizationID], callback);
}

module.exports.deleteGuard = function (id, callback) {
    return db.query("delete from Guard where GuardID=?", [id], callback);
}

module.exports.updateGuard = function (id, Guard, callback) {
    return db.query("update Guard set FirstName=?,LastName=?, OrganizationID=? where GuardID=?", [Guard.FirstName, Guard.LastName, GuardID], callback);
}




