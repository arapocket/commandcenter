var express = require('express');
var router = express.Router();
var Checkpoint = require('../models/Checkpoint');

module.exports.getAllCheckpoints = function (req, res) {
  Checkpoint.getAllCheckpoints(function (err, result) {
    if (err) {
      res.json(err);
    }
    else {
      res.json(result);
    }
  });
};

module.exports.getCheckpointByID = function (req, res) {
  Checkpoint.getCheckpointByID(req.params.id, function (err, result) {
    if (err) {
      res.json(err);
    }
    else {
      res.json(result);
    }
  });
};

module.exports.addCheckpoint = function (req, res) {
  Checkpoint.addCheckpoint(req.body, function (err, result) {
    if (err) {
      res.json(err);
    }
    else {
      res.json(result);
    }
  });
};

module.exports.deleteCheckpoint = function (req, res) {
  Checkpoint.deleteCheckpoint(req.params.id, function (err, result) {
    if (err) {
      res.json(err);
    }
    else {
      res.json(result);
    }
  });
};

module.exports.updateCheckpoint = function (req, res) {
  Checkpoint.updateCheckpoint(req.params.id,req.body, function (err, result) {
    if (err) {
      res.json(err);
    }
    else {
      res.json(result);
    }
  });
};