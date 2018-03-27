var PatrolReplayMapModel = require('../../models/Convoyer/PatrolReplayMapModel');

module.exports.getPatrolReplayMap = (function (req, res) {


  PatrolReplayMapModel.getPatrolReplayMap(req.params.id, function (err, getPatrolReplayMapResult) {
    if (err) {
      // res.json(err);
    } else {
      PatrolReplayMapModel.getIncidents(req.params.id, function (err, getIncidentsResult){
        if (err){
          //res.json(err)
        } else {
          res.render('PatrolReplayMapView', { title: 'Patrol Replay Map', getPatrolReplayMapResult: getPatrolReplayMapResult, getIncidentsResult: getIncidentsResult});
        }
      })              
            }
          })
        });

