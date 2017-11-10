var db = require('./db');

module.exports.getMap = function (callback) {
    db.createConnection(function (err, reslt) {

        if (err){
            callback(err, null);
        }else{
            var connection = reslt;
            var strSQL = ' SELECT * FROM guard';
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