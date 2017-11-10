var FoxMap = require('../models/foxmap');

module.exports.getMap = (function (req, res) {

    FoxMap.getMap(function (err,res){

        if (err){
        }
        else{
            res.render('foxmap', { title: 'FOXMAP'});
        }

    })

});