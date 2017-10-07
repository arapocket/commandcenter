var db = require('./db');



module.exports.getAllPatrols = function (callback) {

    return db.query("Select * from Patrol", callback);

}


module.exportsgetPatrolByID = function (id, callback) {

    return db.query("select * from patrol where PatrolID=?", [id], callback);
}


module.exports.addPatrol = function (Patrol, callback) {
    return db.query("Insert into patrol values(?,?,?,?)", [Patrol.PatrolID, Patrol.FirstName, Patrol.LastName, Patrol.OrganizationID], callback);
}

module.exports.deletePatrol = function (id, callback) {
    return db.query("delete from Patrol where PatrolID=?", [id], callback);
}

module.exports.updatePatrol = function (id, Patrol, callback) {
    return db.query("update Patrol set FirstName=?,LastName=?, OrganizationID=? where PatrolID=?", [Patrol.FirstName, Patrol.LastName, PatrolID], callback);
}




