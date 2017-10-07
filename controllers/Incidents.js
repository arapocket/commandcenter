var express = require('express');
var router = express.Router();
var Incident = require('../models/Incident');

module.exports.getAllIncidents = function (req, res) {
  Incident.getAllIncidents(function (err, result) {
    if (err) {
      res.json(err);
    }
    else {
      res.json(result);
    }
  });
};

module.exports.getIncidentByID = function (req, res) {
  Incident.getIncidentByID(req.params.id, function (err, result) {
    if (err) {
      res.json(err);
    }
    else {
      res.json(result);
    }
  });
};

module.exports.addIncident = function (req, res) {
  Incident.addIncident(req.body, function (err, result) {
    if (err) {
      res.json(err);
    }
    else {
      res.json(result);
    }
  });
};

module.exports.deleteIncident = function (req, res) {
  Incident.deleteIncident(req.params.id, function (err, result) {
    if (err) {
      res.json(err);
    }
    else {
      res.json(result);
    }
  });
};

module.exports.updateIncident = function (req, res) {
  Incident.updateIncident(req.params.id,req.body, function (err, result) {
    if (err) {
      res.json(err);
    }
    else {
      res.json(result);
    }
  });
};