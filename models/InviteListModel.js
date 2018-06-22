var db = require('./db');
var datetime = require('../controllers/datetime');

var time = datetime.syncCurrentDateTimeforDB();

module.exports.postInviteList = function (Body, callback) {

    db.createConnection(function (err, res) {
        if (err) {
            console.log('Error while performing common connect query: ' + err);
            callback(err, null);
        } else {
            //process the i/o after successful connect.  Connection object returned in callback
            var connection = res;

            var queryFields = '(InvitationListID, ListName, ListComment, UpdateTime)';
            var queryValues = '("'+ Body.InvitationListID +'", "'+ Body.ListName +'", "'+ Body.ListComment +'","'+ time + '")';
            var query = 'INSERT INTO invitelist '+ queryFields +' VALUES ' + queryValues;
            connection.query(query, function (err, rows, fields) {
                if (!err) {
                    connection.end();
                    callback(null, rows);

                } else {
                    console.log('error with the createInviteList query');
                    console.log(err);
                    connection.end();
                    callback(err, rows);
                }
            });
        }
    });
}

module.exports.postInvitee = function (Body, callback) {

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
                    console.log('error with the createInviteList query');
                    console.log(err);
                    connection.end();
                    callback(err, rows);
                }
            });
        }
    });
}

module.exports.getLastInviteList = function (callback) {

    db.createConnection(function (err, res) {
        if (err) {
            console.log('Error while performing common connect query: ' + err);
            callback(err, null);
        } else {
            //process the i/o after successful connect.  Connection object returned in callback
            var connection = res;

            var query = 'SELECT LAST_INSERT_ID() FROM invitelist';
            connection.query(query, function (err, rows, fields) {
                if (!err) {
                    connection.end();
                    callback(null, rows);

                } else {
                    console.log('error with the getLastInviteList query');
                    console.log(err);
                    connection.end();
                    callback(err, rows);
                }
            });
        }
    });
}


