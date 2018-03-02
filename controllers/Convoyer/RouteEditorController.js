var RouteEditorModel = require('../../models/Convoyer/RouteEditorModel');

module.exports.getRouteEditor = (function (req, res) {


  RouteEditorModel.getAllRoutes(function (err, getAllRoutesResult) {
    if (err) {
      // res.json(err);
    } else {
      RouteEditorModel.getAllGuards(function (err, getAllGuardsResult) {
        if (err) {
          // res.json(err);
        } else {
          RouteEditorModel.getAllPatrolAreas(function (err, getAllPatrolAreasResult){
            if (err) {
              // res.json(err);
            } else {
              res.render('RouteEditorView', { title: 'Route Editor', getAllGuardsResult: getAllGuardsResult, getAllRoutesResult: getAllRoutesResult, getAllPatrolAreasResult: getAllPatrolAreasResult });
            }
          })
          
        }
      });
    }
  });

});









