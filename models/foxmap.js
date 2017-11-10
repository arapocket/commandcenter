var db = require('./db');

module.exports.getMap = function (callback) {
    db.createConnection(function (err, res) {

        if (err){
            callback(err, null);
        }else{
            callback(res);
        }
        
    });

}