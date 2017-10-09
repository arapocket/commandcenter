var express = require('express');
var router = express.Router();
var GuardPatrol = require('../models/GuardPatrol');

// NEED TO GET ALL THE PATROLS
//FOR EACH CURRENT PATROL
//GIVE ME ALL THE COORDS


module.exports.getAllGuardPatrols = function (req, res) {

  GuardPatrol.getAllGuards(function (err, getAllGuardsResult) {

    if (err) {
      res.json(err);
    }
    else {

      GuardPatrol.getAllCoords(function (err, getAllCoordsResult) {
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
                      res.render('guardpatrols', { title: 'Guard Map', getAllGuardsResult: getAllGuardsResult, getAllCoordsResult: getAllCoordsResult, getAllIncidentsResult: getAllIncidentsResult, getCurrentLocationsResult: getCurrentLocationsResult, getCurrentPatrolsResult: getCurrentPatrolsResult });
                    }
                  })

                }
              })

            }
          });

        }
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
      // AS SELECT i.Description, i.Type, i.lat, i.lng, p.CurrentPatrol
      // FROM incident i
      // INNER JOIN patrol p ON i.PatrolID = p.PatrolID;

      // SELECT Description, Type, lat,  lng, CurrentPatrol FROM allincidents WHERE CurrentPatrol = 1;

      //=========================== VERIFIED SQL STATEMENTS √ =====================================

    }
  });

};

exports.AddGuardPatrol = function (req, res) {
  GuardPatrol.addGuardPatrol(req.body, function (err, loc) {
    if (err) {
      res.json(err);
    }

    else {
      res.render('guardpatrols', { title: 'Guard Map', body: req.body });
    }

  });
}

exports.updateGuardPatrol = function (req, res) {



  GuardPatrol.updateGuardPatrol(req.body, function (err, loc) {

    if (err) {
      res.json(err);
    }

    else {
      res.render('guardpatrols', { title: 'Guard Map', body: req.body });

    }

  });

};
