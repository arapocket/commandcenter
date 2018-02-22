var db = require('../db');



module.exports.getAllIncidents = function (callback) {

    db.createConnection(function (err, reslt) {
        if (err) {
            console.log('Error while performing common connect query: ' + err);
            callback(err, null);
        } else {
            //process the i/o after successful connect.  Connection object returned in callback
            var connection = reslt;

            var strSQL = ' Select * from incident; ';
            connection.query(strSQL, function (err, rows, fields) {
                if (!err) {
                    connection.end();
                    callback(null, rows);

                } else {
                    console.log('error with the select incidentpatrol query');
                    connection.end();
                    callback(err, rows);
                }
            });
        }
    });


}


module.exports.getIncidentByID = function (id, callback) {
    db.createConnection(function (err, reslt) {
        if (err) {
            console.log('Error while performing common connect query: ' + err);
            callback(err, null);
        } else {
            //process the i/o after successful connect.  Connection object returned in callback
            var connection = reslt;

            var strSQL = ' Select * from incident where IncidentID = "' + id + '";';
            connection.query(strSQL, function (err, rows, fields) {
                if (!err) {
                    connection.end();
                    callback(null, rows);

                } else {
                    console.log('error with the select incidentpatrol query');
                    connection.end();
                    callback(err, rows);
                }
            });
        }
    });
}


module.exports.addIncident = function (Incident, callback) {

    db.createConnection(function (err, reslt) {
        if (err) {
            console.log('Error while performing common connect query: ' + err);
            callback(err, null);
        } else {
            //process the i/o after successful connect.  Connection object returned in callback
            var connection = reslt;

            var strSQL = "Insert into incident values ('" + Incident.IncidentID + "', '" + Incident.Description + "', '" + Incident.Type + "', '" + Incident.lat + "', '" + Incident.lng + "', '" + Incident.PatrolID + "', '" + Incident.Media + "');";
            connection.query(strSQL, function (err, rows, fields) {
                if (!err) {
                    connection.end();
                    callback(null, rows);

                } else {
                    console.log('error with the select incidentpatrol query');
                    connection.end();
                    callback(err, rows);
                }
            });
        }
    });
}

module.exports.deleteIncident = function (id, callback) {

    db.createConnection(function (err, reslt) {
        if (err) {
            console.log('Error while performing common connect query: ' + err);
            callback(err, null);
        } else {
            //process the i/o after successful connect.  Connection object returned in callback
            var connection = reslt;

            var strSQL = ' delete from incident where IncidentID = ' + id + ';';
            connection.query(strSQL, function (err, rows, fields) {
                if (!err) {
                    connection.end();
                    callback(null, rows);

                } else {
                    console.log('error with the select incidentpatrol query');
                    connection.end();
                    callback(err, rows);
                }
            });
        }
    });
}

module.exports.updateIncident = function (id, Incident, callback) {

    db.createConnection(function (err, reslt) {
        if (err) {
            console.log('Error while performing common connect query: ' + err);
            callback(err, null);
        } else {
            //process the i/o after successful connect.  Connection object returned in callback
            var connection = reslt;

            var strSQL = 'Update incident set Description = ' + Incident.Description + ', Type = ' + Incident.Type + ', lat = ' + Incident.lat + ', lng = ' + Incident.lng + ', PatrolID = ' + Incident.PatrolID + ', WHERE IncidentID =  ' + Incident.IncidentID + ';';
            connection.query(strSQL, function (err, rows, fields) {
                if (!err) {
                    connection.end();
                    callback(null, rows);

                } else {
                    console.log('error with the select incidentpatrol query');
                    connection.end();
                    callback(err, rows);
                }
            });
        }
    });

}



