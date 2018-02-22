var db = require('../db');



module.exports.getAllPatrolAreas = function (callback) {

    db.createConnection(function (err, reslt) {
        if (err) {
            console.log('Error while performing common connect query: ' + err);
            callback(err, null);
        } else {
            //process the i/o after successful connect.  Connection object returned in callback
            var connection = reslt;

            var strSQL = ' Select * from patrolarea; ';
            connection.query(strSQL, function (err, rows, fields) {
                if (!err) {
                    connection.end();
                    callback(null, rows);

                } else {
                    console.log('error with the select patrolareapatrol query');
                    connection.end();
                    callback(err, rows);
                }
            });
        }
    });


}


module.exports.getPatrolAreaByID = function (id, callback) {
    db.createConnection(function (err, reslt) {
        if (err) {
            console.log('Error while performing common connect query: ' + err);
            callback(err, null);
        } else {
            //process the i/o after successful connect.  Connection object returned in callback
            var connection = reslt;

            var strSQL = ' Select * from patrolarea where PatrolAreaID = "' + id + '";';
            connection.query(strSQL, function (err, rows, fields) {
                if (!err) {
                    connection.end();
                    callback(null, rows);

                } else {
                    console.log('error with the select patrolareapatrol query');
                    connection.end();
                    callback(err, rows);
                }
            });
        }
    });
}


module.exports.addPatrolArea = function (PatrolArea, callback) {

    db.createConnection(function (err, reslt) {
        if (err) {
            console.log('Error while performing common connect query: ' + err);
            callback(err, null);
        } else {
            //process the i/o after successful connect.  Connection object returned in callback
            var connection = reslt;

            var strSQL = "Insert into patrolarea values ('" + PatrolArea.PatrolAreaID + "', '" + PatrolArea.Description + "', '" + PatrolArea.Type + "', '" + PatrolArea.lat + "', '" + PatrolArea.lng + "', '" + PatrolArea.PatrolID + "', '" + PatrolArea.Media + "');";
            connection.query(strSQL, function (err, rows, fields) {
                if (!err) {
                    connection.end();
                    callback(null, rows);

                } else {
                    console.log('error with the select patrolareapatrol query');
                    connection.end();
                    callback(err, rows);
                }
            });
        }
    });
}

module.exports.deletePatrolArea = function (id, callback) {

    db.createConnection(function (err, reslt) {
        if (err) {
            console.log('Error while performing common connect query: ' + err);
            callback(err, null);
        } else {
            //process the i/o after successful connect.  Connection object returned in callback
            var connection = reslt;

            var strSQL = ' delete from patrolarea where PatrolAreaID = ' + id + ';';
            connection.query(strSQL, function (err, rows, fields) {
                if (!err) {
                    connection.end();
                    callback(null, rows);

                } else {
                    console.log('error with the select patrolareapatrol query');
                    connection.end();
                    callback(err, rows);
                }
            });
        }
    });
}

module.exports.updatePatrolArea = function (id, PatrolArea, callback) {

    db.createConnection(function (err, reslt) {
        if (err) {
            console.log('Error while performing common connect query: ' + err);
            callback(err, null);
        } else {
            //process the i/o after successful connect.  Connection object returned in callback
            var connection = reslt;

            var strSQL = 'Update patrolarea set Description = ' + PatrolArea.Description + ', Type = ' + PatrolArea.Type + ', lat = ' + PatrolArea.lat + ', lng = ' + PatrolArea.lng + ', PatrolID = ' + PatrolArea.PatrolID + ', WHERE PatrolAreaID =  ' + PatrolArea.PatrolAreaID + ';';
            connection.query(strSQL, function (err, rows, fields) {
                if (!err) {
                    connection.end();
                    callback(null, rows);

                } else {
                    console.log('error with the select patrolareapatrol query');
                    connection.end();
                    callback(err, rows);
                }
            });
        }
    });

}




