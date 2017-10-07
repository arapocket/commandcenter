var express = require('express');
var router = express.Router();
var Patrol = require('../models/Patrol');

module.exports.getAllPatrols = function (req, res) {
  Patrol.getAllPatrols(function (err, result) {
    if (err) {
      res.json(err);
    }
    else {
      res.json(result);
    }
  });
};

module.exports.getPatrolByID = function (req, res) {
  Patrol.getPatrolByID(req.params.id, function (err, result) {
    if (err) {
      res.json(err);
    }
    else {
      res.json(result);
    }
  });
};

module.exports.addPatrol = function (req, res) {
  Patrol.addPatrol(req.body, function (err, result) {
    if (err) {
      res.json(err);
    }
    else {
      res.json(result);
    }
  });
};

module.exports.updatePatrol = function (req, res) {
  Patrol.updatePatrol(req.body, function (err, result) {
    if (err) {
      res.json(err);
    }
    else {
      res.json(result);
    }
  });
};

module.exports.deletePatrol = function (req, res) {
  Patrol.deletePatrol(req.params.id, function (err, result) {
    if (err) {
      res.json(err);
    }
    else {
      res.json(result);
    }
  });
};



