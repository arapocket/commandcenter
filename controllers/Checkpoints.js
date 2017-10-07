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
  Checkpoint.getCheckpointByID(function (err, result) {
    if (err) {
      res.json(err);
    }
    else {
      res.json(result);
    }
  });
};

module.exports.addCheckpoint = function (req, res) {
  Checkpoint.addCheckpoint(function (err, result) {
    if (err) {
      res.json(err);
    }
    else {
      res.json(result);
    }
  });
};

module.exports.deleteCheckpoint = function (req, res) {
  Checkpoint.deleteCheckpoint(function (err, result) {
    if (err) {
      res.json(err);
    }
    else {
      res.json(result);
    }
  });
};

module.exports.updateCheckpoint = function (req, res) {
  Checkpoint.updateCheckpoint(function (err, result) {
    if (err) {
      res.json(err);
    }
    else {
      res.json(result);
    }
  });
};