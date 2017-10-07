var db = require('./db');



module.exports.getAllIncidents = function (callback) {

    return db.query("Select * from Incident", callback);

}


module.exportsgetIncidentByID = function (id, callback) {

    return db.query("select * from incident where IncidentID=?", [id], callback);
}


module.exports.addIncident = function (Incident, callback) {
    return db.query("Insert into incident values(?,?,?,?)", [Incident.IncidentID, Incident.FirstName, Incident.LastName, Incident.OrganizationID], callback);
}

module.exports.deleteIncident = function (id, callback) {
    return db.query("delete from Incident where IncidentID=?", [id], callback);
}

module.exports.updateIncident = function (id, Incident, callback) {
    return db.query("update Incident set FirstName=?,LastName=?, OrganizationID=? where IncidentID=?", [Incident.FirstName, Incident.LastName, IncidentID], callback);
}




