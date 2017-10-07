var express = require('express');
var router = express.Router();
var Patrol = require('../models/Patrol');

module.exports.getAllPatrols = function (req, res) {
  Guard.getAllPatrols(function (err, result) {
    if (err) {
      res.json(err);
    }
    else {
      res.json(result);
    }
  });
};

module.exports.getPatrolByID = function (req, res) {
  Guard.getPatrolByID(req.params.id, function (err, result) {
    if (err) {
      res.json(err);
    }
    else {
      res.json(result);
    }
  });
};

module.exports.addPatrol = function (req, res) {
  Guard.addPatrol(req.body, function (err, result) {
    if (err) {
      res.json(err);
    }
    else {
      res.json(result);
    }
  });
};

module.exports.updatePatrol = function (req, res) {
  Guard.updatePatrol(req.params.id,req.body, function (err, result) {
    if (err) {
      res.json(err);
    }
    else {
      res.json(result);
    }
  });
};

module.exports.deletePatrol = function (req, res) {
  Guard.deletePatrol(req.params.id, function (err, result) {
    if (err) {
      res.json(err);
    }
    else {
      res.json(result);
    }
  });
};



