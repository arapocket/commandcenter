var RouteEditor = require('../models/RouteEditorMapModel');

module.exports.getRouteEditorMap = (function (req, res) {


  RouteEditor.getAllRoutes(function (err, getAllRoutesResult) {
    if (err) {
      res.json(err);
    } else {
      RouteEditor.getAllGuards(function (err, getAllGuardsResult) {
        if (err) {
          res.json(err);
        } else {
          res.render('RouteEditorView', { title: 'Route Editor', getAllGuardsResult: getAllGuardsResult, getAllRoutesResult: getAllRoutesResult });
        }
      });
    }
  });

});

//=========================== VERIFIED SQL STATEMENTS √ =====================================

    // *************    SHOW GUARD NAMES ON MAP

    // CREATE VIEW allguards
    // AS SELECT g.FirstName, g.LastName, g.DeviceToken, g.GuardID, p.PatrolID,  p.CurrentPatrol
    // FROM guard g
    // INNER JOIN patrol p ON g.GuardID = p.GuardID;

    //  SELECT FirstName, LastName, CurrentPatrol FROM allguards WHERE CurrentPatrol = 1;

    // *************    SHOW CURRENT COORDS ON MAP

    // CREATE VIEW allcoords
    // AS SELECT c.Sequence, c.lat, c.lng, p.CurrentPatrol, p.PatrolID, p.GuardID
    // FROM coordinate c
    // INNER JOIN patrol p ON c.PatrolID = p.PatrolID;

    // SELECT Sequence, lat, lng, CurrentPatrol FROM allcoords WHERE CurrentPatrol = 1;


    // *************    SHOW ALL INCIDENTS ON MAP

    // CREATE VIEW allincidents
    // AS SELECT i.IncidentID, i.Description, i.Type, i.lat, i.lng, p.CurrentPatrol, i.Media
    // FROM incident i
    // INNER JOIN patrol p ON i.PatrolID = p.PatrolID;

    // SELECT IncidentID, Description, Type, lat,  lng, CurrentPatrol FROM allincidents WHERE CurrentPatrol = 1;

    // *************    SHOW ALL ROUTES ON MAP 


    // CREATE VIEW allcheckpoints
    // AS SELECT c.Sequence, c.lat, c.lng, r.CurrentRoute, r.RouteID
    // FROM checkpoint c
    // INNER JOIN route r ON c.RouteID = r.RouteID;

    // SELECT Sequence, lat, lng, CurrentRoute FROM allcheckpoints WHERE CurrentRoute = 1;


    // *************    currentlocations VIEW

    /*

CREATE VIEW currentlocations
AS SELECT p.CurrentPatrol, g.FirstName, g.LastName, g.DeviceToken, g.GuardID, p.PatrolID
FROM patrol p
INNER JOIN guard g ON p.GuardID = g.GuardID 

    **/


    // *************    currentguards VIEW

    /*

CREATE VIEW currentguards
AS SELECT  c.CurrentCoord, l.CurrentPatrol,  l.FirstName,  l.LastName,  l.DeviceToken,  l.GuardID, l.PatrolID, c.lat, c.lng
FROM currentlocations l
INNER JOIN coordinate c ON l.PatrolID = c.PatrolID 

    **/


    //=========================== VERIFIED SQL STATEMENTS √ =====================================




