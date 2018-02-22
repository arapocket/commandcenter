var ConvoyerMapModel = require('../../models/Convoyer/ConvoyerMapModel');

module.exports.getAllGuardPatrols = (function (req, res) {

  ConvoyerMapModel.getAllGuards(function (err, getAllGuardsResult) {

    if (err) {
      res.json(err);
    }
    else {

      ConvoyerMapModel.getCurrentCoords(function (err, getCurrentCoordsResult) {
        if (err) {
          res.json(err);
        }
        else {
          ConvoyerMapModel.getAllIncidents(function (err, getAllIncidentsResult) {
            if (err) {
              res.json(err);
            }
            else {
              ConvoyerMapModel.getCurrentLocations(function (err, getCurrentLocationsResult) {
                if (err) {
                  res.json(err);
                }
                else {
                  ConvoyerMapModel.getCurrentPatrols(function (err, getCurrentPatrolsResult) {
                    if (err) {
                      res.json(err);
                    }
                    else {
                      ConvoyerMapModel.getCurrentRoutes(function (err, getCurrentRoutesResult) {
                        if (err) {
                          res.json(err);
                        } else {
                          ConvoyerMapModel.getCurrentCheckpoints(function (err, getCurrentCheckpointsResult) {
                            if (err) {
                              res.json(err);
                            } else {
                              res.render('ConvoyerMapView', { title: 'Guard Map', getAllGuardsResult: getAllGuardsResult, getCurrentCoordsResult: getCurrentCoordsResult, getAllIncidentsResult: getAllIncidentsResult, getCurrentLocationsResult: getCurrentLocationsResult, getCurrentPatrolsResult: getCurrentPatrolsResult, getCurrentRoutesResult: getCurrentRoutesResult, getCurrentCheckpointsResult: getCurrentCheckpointsResult});
                            }
                          });
                        }
                      });
                    }
                  });
                }
              });
            }
          });
        }
      });
    }
  });
});










//=========================== VERIFIED SQL STATEMENTS √ =====================================

    // *************    SHOW GUARD NAMES ON MAP

    // CREATE VIEW allguards
    // AS SELECT g.FirstName, g.LastName, p.CurrentPatrol
    // FROM guard g
    // INNER JOIN patrol p ON g.GuardID = p.GuardID;

    //  SELECT FirstName, LastName, CurrentPatrol FROM allguards WHERE CurrentPatrol = 1;

    // *************    SHOW CURRENT COORDS ON MAP

    // CREATE VIEW allcoords
    // AS SELECT c.Sequence, c.lat, c.lng, p.CurrentPatrol, p.PatrolID
    // FROM coordinate c
    // INNER JOIN patrol p ON c.PatrolID = p.PatrolID;

    // SELECT Sequence, lat, lng, CurrentPatrol FROM allcoords WHERE CurrentPatrol = 1;


    // *************    SHOW ALL INCIDENTS ON MAP

    // CREATE VIEW allincidents
    // AS SELECT i.IncidentID, i.Description, i.Type, i.lat, i.lng, p.CurrentPatrol
    // FROM incident i
    // INNER JOIN patrol p ON i.PatrolID = p.PatrolID;

    // SELECT IncidentID, Description, Type, lat,  lng, CurrentPatrol FROM allincidents WHERE CurrentPatrol = 1;

    // *************    SHOW ALL ROUTES ON MAP 


    // CREATE VIEW allcheckpoints
    // AS SELECT c.Sequence, c.lat, c.lng, r.CurrentRoute, r.RouteID
    // FROM checkpoint c
    // INNER JOIN route r ON c.RouteID = r.RouteID;

    // SELECT Sequence, lat, lng, CurrentRoute FROM allcheckpoints WHERE CurrentRoute = 1;


    //=========================== VERIFIED SQL STATEMENTS √ =====================================



