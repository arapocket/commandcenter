var RouteEditorMapModel = require('../../models/Convoyer/RouteEditorMapModel');

module.exports.getRouteEditorMap = (function (req, res) {


  RouteEditorMapModel.getAllRoutes(function (err, getAllRoutesResult) {
    if (err) {
      // res.json(err);
    } else {
      RouteEditorMapModel.getAllGuards(function (err, getAllGuardsResult) {
        if (err) {
          // res.json(err);
        } else {

          RouteEditorMapModel.getAllPatrolAreas(function (err, getAllPatrolAreasResult) {
            if (err) {

            } else {
              res.render('RouteEditorMapView', { title: 'Route Editor Map', getAllGuardsResult: getAllGuardsResult, getAllRoutesResult: getAllRoutesResult, getAllPatrolAreasResult: getAllPatrolAreasResult });
            }
          })


        }
      });
    }
  });

});



