var express = require('express');
var router = express.Router();
var Coordinate = require('../models/Coordinate');

module.exports.getAllCoordinates = function (req, res) {
  Coordinate.getAllCoordinates(function (err, result) {
    if (err) {
      res.json(err);
    }
    else {
      res.json(result);
    }
  });
};

module.exports.getCoordinateByID = function (req, res) {
  Coordinate.getCoordinateByID(req.params.id, function (err, result) {
    if (err) {
      res.json(err);
    }
    else {
      res.json(result);
    }
  });
};

module.exports.addCoordinate = function (req, res) {
  Coordinate.addCoordinate(req.body, function (err, result) {
    if (err) {
      res.json(err);
    }
    else {
      res.json(result);
    }
  });
};

module.exports.deleteCoordinate = function (req, res) {
  Coordinate.deleteCoordinate(req.params.id, function (err, result) {
    if (err) {
      res.json(err);
    }
    else {
      res.json(result);
    }
  });
};

module.exports.updateCoordinate = function (req, res) {
  Coordinate.updateCoordinate(req.params.id,req.body, function (err, result) {
    if (err) {
      res.json(err);
    }
    else {
      res.json(result);
    }
  });
};