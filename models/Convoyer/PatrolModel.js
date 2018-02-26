var db = require('../db');
var datetime = require('../../controllers/datetime');


module.exports.getAllPatrols = function (callback) {

    db.createConnection(function (err, reslt) {
        if (err) {
            console.log('Error while performing common connect query: ' + err);
            callback(err, null);
        } else {
            //process the i/o after successful connect.  Connection object returned in callback
            var connection = reslt;

            var strSQL = ' Select * from Patrol; ';
            connection.query(strSQL, function (err, rows, fields) {
                if (!err) {
                    connection.end();
                    callback(null, rows);

                } else {
                    console.log('error with the select patrolpatrol query');
                    connection.end();
                    callback(err, rows);
                }
            });
        }
    });


}


module.exportsgetPatrolByID = function (id, callback) {
    db.createConnection(function (err, reslt) {
        if (err) {
            console.log('Error while performing common connect query: ' + err);
            callback(err, null);
        } else {
            //process the i/o after successful connect.  Connection object returned in callback
            var connection = reslt;

            var strSQL = " Select * from patrol where PatrolID = " + id + ";";
            connection.query(strSQL, function (err, rows, fields) {
                if (!err) {
                    connection.end();
                    callback(null, rows);

                } else {
                    console.log('error with the select patrolpatrol query');
                    connection.end();
                    callback(err, rows);
                }
            });
        }
    });
}


module.exports.addPatrol = function (Patrol, callback) {

    db.createConnection(function (err, reslt) {
        if (err) {
            console.log('Error while performing common connect query: ' + err);
            callback(err, null);
        } else {
            //process the i/o after successful connect.  Connection object returned in callback
            var connection = reslt;

            let date = datetime.syncCurrentDateTimeforDB();

            var strSQL = "Insert into patrol values ('" + Patrol.PatrolID + "', '" + Patrol.GuardID + "', " + Patrol.CurrentPatrol + ", '" + date + "', ''  );";
            connection.query(strSQL, function (err, rows, fields) {
                if (!err) {
                    connection.end();
                    callback(null, rows);

                } else {
                    console.log('error with the select patrolpatrol query');
                    connection.end();
                    callback(err, rows);
                }
            });
        }
    });
}

module.exports.deletePatrol = function (id, callback) {

    db.createConnection(function (err, reslt) {
        if (err) {
            console.log('Error while performing common connect query: ' + err);
            callback(err, null);
        } else {
            //process the i/o after successful connect.  Connection object returned in callback
            var connection = reslt;

            var strSQL = " delete from patrol where PatrolID = '" + id + "';";
            connection.query(strSQL, function (err, rows, fields) {
                if (!err) {
                    connection.end();
                    callback(null, rows);

                } else {
                    console.log('error with the select patrolpatrol query');
                    connection.end();
                    callback(err, rows);
                }
            });
        }
    });
}

module.exports.updatePatrol = function (Patrol, callback) {

    db.createConnection(function (err, reslt) {
        if (err) {
            console.log('Error while performing common connect query: ' + err);
            callback(err, null);
        } else {
            //process the i/o after successful connect.  Connection object returned in callback
            var connection = reslt;

            let date = datetime.syncCurrentDateTimeforDB();

            var strSQL = "Update patrol SET CurrentPatrol = " + Patrol.CurrentPatrol + ", End = '" + date + "' WHERE PatrolID =  '" + Patrol.PatrolID + "';";
            connection.query(strSQL, function (err, rows, fields) {
                if (!err) {
                    connection.end();
                    callback(null, rows);
                } else {
                    console.log('error with the select patrolpatrol query');
                    connection.end();
                    callback(err, rows);
                }
            });
        }
    });

}




