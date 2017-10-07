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
  Incident.getIncidentByID(function (err, result) {
    if (err) {
      res.json(err);
    }
    else {
      res.json(result);
    }
  });
};

module.exports.addIncident = function (req, res) {
  Incident.addIncident(function (err, result) {
    if (err) {
      res.json(err);
    }
    else {
      res.json(result);
    }
  });
};

module.exports.deleteIncident = function (req, res) {
  Incident.deleteIncident(function (err, result) {
    if (err) {
      res.json(err);
    }
    else {
      res.json(result);
    }
  });
};

module.exports.updateIncident = function (req, res) {
  Incident.updateIncident(function (err, result) {
    if (err) {
      res.json(err);
    }
    else {
      res.json(result);
    }
  });
};