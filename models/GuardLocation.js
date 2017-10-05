var db = require('./db');



    module.exports.getAllGuardLocations = function (callback) {

        //get a connection using the common handler in models/db.js
        db.createConnection(function (err, reslt) {
            if (err) {
                console.log('Error while performing common connect query: ' + err);
                callback(err, null);
            } else {
                //process the i/o after successful connect.  Connection object returned in callback
                var connection = reslt;

                var strSQL = 'Select * from guardlocation';
                connection.query(strSQL, function (err, rows, fields) {
                    if (!err) {
                        connection.end();
                        callback(null, rows);

                    } else {
                        console.log('error with the select guardlocations query');
                        connection.end();
                        callback(err, rows);
                    }
                });
            }
        });


    }
//     getGuardLocationByID: function (id, callback) {

//         return db.query("select * from guardlocation where GuardID=?", [id], callback);
//     },
//     addGuardLocation: function (GuardLocation, callback) {
//         return db.query("Insert into guardlocation values(?,?,?,?)", [GuardLocation.LocationID, GuardLocation.lat, GuardLocation.lng, GuardLocation.GuardID], callback);
//     },
//     deleteGuardLocation: function (id, callback) {
//         return db.query("delete from guardlocation where GuardID=?", [id], callback);
//     },
//     updateGuardLocation: function (GuardLocation, callback) {
//         return db.query("update guardlocation set lat=?, lng=?, LocationID=? where GuardID=?", [GuardLocation.lat, GuardLocation.lng, GuardLocation.LocationID, GuardLocation.GuardID], callback);
//     }

// };
// module.exports = GuardLocation;



