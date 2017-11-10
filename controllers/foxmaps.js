var FoxMap = require('../models/foxmap');

module.exports.getMap = (function (req, res) {

    FoxMap.getMap(function (err,result){

        if (err){
            res.json(err);
        }
        else{
            res.render('foxmaps', {});
        }

    })

});