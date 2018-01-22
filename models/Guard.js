var db = require('./db');
var crypto = require('crypto')


module.exports.getAllGuards = function (callback) {

    db.createConnection(function (err, reslt) {
        if (err) {
            console.log('Error while performing common connect query: ' + err);
            callback(err, null);
        } else {
            //process the i/o after successful connect.  Connection object returned in callback
            var connection = reslt;

            var strSQL = ' Select * from guard; ';
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


module.exports.getGuardByID = function (id, callback) {
    db.createConnection(function (err, reslt) {
        if (err) {
            console.log('Error while performing common connect query: ' + err);
            callback(err, null);
        } else {
            //process the i/o after successful connect.  Connection object returned in callback
            var connection = reslt;

            var strSQL = " Select * from guard where GuardID = '" + id + "';";
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


module.exports.addGuard = function (Guard, callback) {

    db.createConnection(function (err, reslt) {
        if (err) {
            console.log('Error while performing common connect query: ' + err);
            callback(err, null);
        } else {
            //process the i/o after successful connect.  Connection object returned in callback
            var connection = reslt;

            var strSQL = "Insert into guard values ('" + Guard.GuardID + "', '" + Guard.FirstName + "', '" + Guard.LastName + "', '" + Guard.DeviceToken + "');";
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

module.exports.deleteGuard = function (id, callback) {

    db.createConnection(function (err, reslt) {
        if (err) {
            console.log('Error while performing common connect query: ' + err);
            callback(err, null);
        } else {
            //process the i/o after successful connect.  Connection object returned in callback
            var connection = reslt;

            var strSQL = " delete from guard where GuardID = '" + id + "';";
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

module.exports.updateGuard = function (Guard, callback) {

    db.createConnection(function (err, reslt) {
        if (err) {
            console.log('Error while performing common connect query: ' + err);
            callback(err, null);
        } else {
            //process the i/o after successful connect.  Connection object returned in callback
            var connection = reslt;

            var strSQL = "Update guard set DeviceToken = '" + Guard.DeviceToken + "' WHERE GuardID =  '" + Guard.GuardID + "';";
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

module.exports.saltHashPassword = function (userpassword) {
        var salt = genRandomString(16); /** Gives us salt of length 16 */
        var passwordData = sha512(userpassword, salt);
        console.log('UserPassword = '+userpassword);
        console.log('Passwordhash = '+passwordData.passwordHash);
        console.log('nSalt = '+passwordData.salt);
        return {
            hash : passwordData.passwordHash,
            salt : salt
        }
    
    
    };
    




