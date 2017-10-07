var db = require('./db');



module.exports.getAllCheckpoints = function (callback) {

    return db.query("Select * from Checkpoint", callback);

}


module.exportsgetCheckpointByID = function (id, callback) {

    return db.query("select * from checkpoint where CheckpointID=?", [id], callback);
}


module.exports.addCheckpoint = function (Checkpoint, callback) {
    return db.query("Insert into checkpoint values(?,?,?,?)", [Checkpoint.CheckpointID, Checkpoint.FirstName, Checkpoint.LastName, Checkpoint.OrganizationID], callback);
}

module.exports.deleteCheckpoint = function (id, callback) {
    return db.query("delete from Checkpoint where CheckpointID=?", [id], callback);
}

module.exports.updateCheckpoint = function (id, Checkpoint, callback) {
    return db.query("update Checkpoint set FirstName=?,LastName=?, OrganizationID=? where CheckpointID=?", [Checkpoint.FirstName, Checkpoint.LastName, CheckpointID], callback);
}




