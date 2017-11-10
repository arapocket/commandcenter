var FoxMap = require('../models/foxmap');

module.exports.getMap = (function (req, res) {

    FoxMap.getMap(function (err,res){

        if (err){
            res.json(err);
        }
        else{
            res.render('foxmaps', { title: 'FOXMAP'});
        }

    })

});