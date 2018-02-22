var db = require('../db');



module.exports.getAllCoordinates = function (callback) {

    db.createConnection(function (err, reslt) {
        if (err) {
            console.log('Error while performing common connect query: ' + err);
            callback(err, null);
        } else {
            //process the i/o after successful connect.  Connection object returned in callback
            var connection = reslt;

            var strSQL = ' Select * from coordinate; ';
            connection.query(strSQL, function (err, rows, fields) {
                if (!err) {
                    connection.end();
                    callback(null, rows);

                } else {
                    console.log('error with the select coordinatepatrol query');
                    connection.end();
                    callback(err, rows);
                }
            });
        }
    });


}


module.exportsgetCoordinateByID = function (id, callback) {
    db.createConnection(function (err, reslt) {
        if (err) {
            console.log('Error while performing common connect query: ' + err);
            callback(err, null);
        } else {
            //process the i/o after successful connect.  Connection object returned in callback
            var connection = reslt;

            var strSQL = " Select * from coordinate where CoordID = '" + id + "';";
            connection.query(strSQL, function (err, rows, fields) {
                if (!err) {
                    connection.end();
                    callback(null, rows);

                } else {
                    console.log('error with the select coordinatepatrol query');
                    connection.end();
                    callback(err, rows);
                }
            });
        }
    });
}


module.exports.addCoordinate = function (CoordinateModel, callback) {

    db.createConnection(function (err, reslt) {
        if (err) {
            console.log('Error while performing common connect query: ' + err);
            callback(err, null);
        } else {
            //process the i/o after successful connect.  Connection object returned in callback
            var connection = reslt;

            var strSQL = "Insert into coordinate values ('" + CoordinateModel.CoordID + "', '" + CoordinateModel.Sequence + "', '" + CoordinateModel.lat + "', '" + CoordinateModel.lng + "', '" + CoordinateModel.PatrolID + "', " + CoordinateModel.CurrentCoord + " );";
            connection.query(strSQL, function (err, rows, fields) {
                if (!err) {
                    connection.end();
                    callback(null, rows);

                } else {
                    console.log('error with the add coordinate query');
                    console.log(err);
                    connection.end();
                    callback(err, rows);
                }
            });
        }
    });
}

module.exports.deleteCoordinate = function (id, callback) {

    db.createConnection(function (err, reslt) {
        if (err) {
            console.log('Error while performing common connect query: ' + err);
            callback(err, null);
        } else {
            //process the i/o after successful connect.  Connection object returned in callback
            var connection = reslt;

            var strSQL = " delete from coordinate where PatrolID = '" + id + "';";
            connection.query(strSQL, function (err, rows, fields) {
                if (!err) {
                    console.log('logging coord delete response');
                    console.log(rows);
                    connection.end();
                    callback(null, rows);

                } else {
                    console.log('error with deleteCoordinate query');
                    console.log(err);
                    connection.end();
                    callback(err, rows);
                }
            });
        }
    });
}

module.exports.updateCoordinate = function (CoordinateModel, callback) {

    db.createConnection(function (err, reslt) {
        if (err) {
            console.log('Error while performing common connect query: ' + err);
            callback(err, null);
        } else {
            //process the i/o after successful connect.  Connection object returned in callback
            var connection = reslt;

            var strSQL = "Update currentguards SET CurrentCoord = " + CoordinateModel.CurrentCoord + " WHERE GuardID = '" + CoordinateModel.GuardID + "';";
            connection.query(strSQL, function (err, rows, fields) {
                if (!err) {
                    connection.end();
                    callback(null, rows);

                } else {
                    console.log('error with the select coordinatepatrol query');
                    connection.end();
                    callback(err, rows);
                }
            });
        }
    });

}






