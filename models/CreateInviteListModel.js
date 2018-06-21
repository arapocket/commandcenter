var db = require('./db');
var datetime = require('./datetime');

var time = datetime.syncCurrentDateTimeforDB();



module.exports.createInviteList = function (Body, callback) {

    db.createConnection(function (err, res) {
        if (err) {
            console.log('Error while performing common connect query: ' + err);
            callback(err, null);
        } else {
            //process the i/o after successful connect.  Connection object returned in callback
            var connection = res;

            var queryFields = '(InvitationListID, BadgeNumber, LastName, FirstName, EmailAddress, UpdateTime)';
            var queryValues = '("'+ Body.InvitationListID +'", "'+ Body.BadgeNumber +'", "'+ Body.LastName +'", "'+ Body.FirstName +'", "'+ Body.EmailAddress +'", "'+ time + '")';
            var query = 'INSERT INTO invitees '+queryFields +' VALUES ' + queryValues;
            connection.query(query, function (err, rows, fields) {
                if (!err) {
                    connection.end();
                    callback(null, rows);

                } else {
                    console.log('error with the query');
                    connection.end();
                    callback(err, rows);
                }
            });
        }
    });
}



