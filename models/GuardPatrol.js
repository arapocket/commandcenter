var db = require('./db');




// GETS ALL THE GUARDS WITH A CURRENT SHIFT
module.exports.getAllGuards = function (callback) {

    //get a connection using the common handler in models/db.js
    db.createConnection(function (err, reslt) {
        if (err) {
            console.log('Error while performing common connect query: ' + err);
            callback(err, null);
        } else {
            //process the i/o after successful connect.  Connection object returned in callback
            var connection = reslt;

            var strSQL = ' SELECT FirstName, LastName, CurrentPatrol FROM allguards WHERE CurrentPatrol = 1; ';
            connection.query(strSQL, function (err, rows, fields) {
                if (!err) {
                    connection.end();
                    callback(null, rows);

                } else {
                    console.log('error with the select guardpatrol query');
                    connection.end();
                    callback(err, rows);
                }
            });
        }
    });
}

// GETS ALL THE COORDS IN THE CURRENT SHIFT
module.exports.getAllCoords = function (callback) {

    //get a connection using the common handler in models/db.js
    db.createConnection(function (err, reslt) {
        if (err) {
            console.log('Error while performing common connect query: ' + err);
            callback(err, null);
        } else {
            //process the i/o after successful connect.  Connection object returned in callback
            var connection = reslt;

            var strSQL = 'SELECT Sequence, lat, lng, PatrolID FROM allcoords WHERE CurrentPatrol = 1 ORDER BY Sequence ASC;';
            connection.query(strSQL, function (err, rows, fields) {
                if (!err) {
                    connection.end();
                    callback(null, rows);

                } else {
                    console.log('error with the select coord query');
                    connection.end();
                    callback(err, rows);
                }
            });
        }
    });
}

// GETS ALL THE INCIDENTS IN THE CURRENT SHIFT
module.exports.getAllIncidents = function (callback) {


    //get a connection using the common handler in models/db.js
    db.createConnection(function (err, reslt) {
        if (err) {
            console.log('Error while performing common connect query: ' + err);
            callback(err, null);
        } else {
            //process the i/o after successful connect.  Connection object returned in callback
            var connection = reslt;

            var strSQL = 'SELECT Description, Type, lat,  lng, CurrentPatrol FROM allincidents WHERE CurrentPatrol = 1';
            connection.query(strSQL, function (err, rows, fields) {
                if (!err) {
                    connection.end();
                    callback(null, rows);

                } else {
                    console.log('error with the select incident query');
                    connection.end();
                    callback(err, rows);
                }
            });
        }
    });
}

// GETS ALL THE LOCATIONS IN THE CURRENT SHIFT
module.exports.getCurrentLocations = function (callback) {


    //get a connection using the common handler in models/db.js
    db.createConnection(function (err, reslt) {
        if (err) {
            console.log('Error while performing common connect query: ' + err);
            callback(err, null);
        } else {
            //process the i/o after successful connect.  Connection object returned in callback
            var connection = reslt;

            var strSQL = 'SELECT lat, lng FROM coordinate WHERE CurrentCoord = 1';
            connection.query(strSQL, function (err, rows, fields) {
                if (!err) {
                    connection.end();
                    callback(null, rows);

                } else {
                    console.log('error with the select incident query');
                    connection.end();
                    callback(err, rows);
                }
            });
        }
    });
}

// GETS ALL THE PATROLS IN THE CURRENT SHIFT
module.exports.getCurrentPatrols = function (callback) {
    
    
        //get a connection using the common handler in models/db.js
        db.createConnection(function (err, reslt) {
            if (err) {
                console.log('Error while performing common connect query: ' + err);
                callback(err, null);
            } else {
                //process the i/o after successful connect.  Connection object returned in callback
                var connection = reslt;
    
                var strSQL = 'SELECT PatrolID FROM patrol WHERE CurrentPatrol = 1;';
                connection.query(strSQL, function (err, rows, fields) {
                    if (!err) {
                        connection.end();
                        callback(null, rows);
    
                    } else {
                        console.log('error with the select patrol query');
                        connection.end();
                        callback(err, rows);
                    }
                });
            }
        });
    }






