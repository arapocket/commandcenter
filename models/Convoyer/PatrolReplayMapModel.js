var db = require('../db');



module.exports.getPatrolReplayMap = function (id, callback) {


    //get a connection using the common handler in models/db.js
    db.createConnection(function (err, reslt) {
        if (err) {
            
            callback(err, null);
        } else {
            //process the i/o after successful connect.  Connection object returned in callback
            var connection = reslt;

            var strSQL = 'SELECT  * FROM currentguards WHERE PatrolID = "' + id + '";';
            connection.query(strSQL, function (err, rows, fields) {
                if (!err) {
                    connection.end();
                    callback(null, rows);

                } else {
                    console.log('error with the incident query');
                    connection.end();
                    callback(err, rows);
                }
            });
        }
    });
}




