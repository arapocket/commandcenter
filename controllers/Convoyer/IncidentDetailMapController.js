var IncidentDetailMapModel = require('../../models/Convoyer/IncidentDetailMapModel');

module.exports.getIncidentDetailMap = (function (req, res) {


    IncidentDetailMapModel.getIncidentDetailMap(req.params.id, function (err, getIncidentDetailMapResult) {
        if (err) {
            // res.json(err);
        } else {
            res.render('IncidentDetailMapView', { title: 'Incident Detail Map', getIncidentDetailMapResult: getIncidentDetailMapResult});

        }
    })


});

