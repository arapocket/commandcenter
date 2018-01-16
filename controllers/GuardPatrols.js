var GuardPatrol = require('../models/GuardPatrol');

module.exports.getAllGuardPatrols = (function (req, res) {

  GuardPatrol.getAllGuards(function (err, getAllGuardsResult) {

    if (err) {
      res.json(err);
    }
    else {

      GuardPatrol.getCurrentCoords(function (err, getCurrentCoordsResult) {
        if (err) {
          res.json(err);
        }
        else {
          GuardPatrol.getAllIncidents(function (err, getAllIncidentsResult) {
            if (err) {
              res.json(err);
            }
            else {
              GuardPatrol.getCurrentLocations(function (err, getCurrentLocationsResult) {
                if (err) {
                  res.json(err);
                }
                else {
                  GuardPatrol.getCurrentPatrols(function (err, getCurrentPatrolsResult) {
                    if (err) {
                      res.json(err);
                    }
                    else {
                      GuardPatrol.getCurrentRoutes(function (err, getCurrentRoutesResult) {
                        if (err) {
                          res.json(err);
                        } else {
                          GuardPatrol.getCurrentCheckpoints(function (err, getCurrentCheckpointsResult) {
                            if (err) {
                              res.json(err);
                            } else {
                              console.log('logging getallguards from guardpatrols');
                              console.log(getAllGuardsResult);
                              res.render('guardpatrols', { title: 'Guard Map', getAllGuardsResult: getAllGuardsResult, getCurrentCoordsResult: getCurrentCoordsResult, getAllIncidentsResult: getAllIncidentsResult, getCurrentLocationsResult: getCurrentLocationsResult, getCurrentPatrolsResult: getCurrentPatrolsResult, getCurrentRoutesResult: getCurrentRoutesResult, getCurrentCheckpointsResult: getCurrentCheckpointsResult});
                      
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

module.exports.getActiveGuards = (function (req, res) {

  GuardPatrol.getAllGuards(function (err, getAllGuardsResult) {

    if (err) {
      res.json(err);
    }
    else {
      res.json(getAllGuardsResult);
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


    // *************    currentlocations VIEW

    /*

CREATE VIEW currentlocations
AS SELECT p.CurrentPatrol, g.FirstName, g.LastName, g.DeviceToken, g.GuardID, p.PatrolID, g.OrganizationID
FROM patrol p
INNER JOIN guard g ON p.GuardID = g.GuardID 

    **/


    // *************    currentguards VIEW

    /*

CREATE VIEW currentguards
AS SELECT  c.CurrentCoord, l.CurrentPatrol,  l.FirstName,  l.LastName,  l.DeviceToken,  l.GuardID, l.PatrolID, c.lat, c.lng, l.OrganizationID  
FROM currentlocations l
INNER JOIN coordinate c ON l.PatrolID = c.PatrolID 

    **/    


    //=========================== VERIFIED SQL STATEMENTS √ =====================================




