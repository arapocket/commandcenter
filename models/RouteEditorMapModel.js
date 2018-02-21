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

            var strSQL = ' SELECT * FROM guard';
            connection.query(strSQL, function (err, rows, fields) {
                if (!err) {
                    console.log(rows);
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

// GETS ALL THE INCIDENTS IN THE CURRENT SHIFT
module.exports.getAllRoutes = function (callback) {


    //get a connection using the common handler in models/db.js
    db.createConnection(function (err, reslt) {
        if (err) {
            console.log('Error while performing common connect query: ' + err);
            callback(err, null);
        } else {
            //process the i/o after successful connect.  Connection object returned in callback
            var connection = reslt;

            var strSQL = 'SELECT  * FROM route';
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







