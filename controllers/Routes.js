var express = require('express');
var router = express.Router();
var Route = require('../models/Route');

module.exports.getAllRoutes = function (req, res) {
  Route.getAllRoutes(function (err, result) {
    if (err) {
      res.json(err);
    }
    else {
      res.json(result);
    }
  });
};

module.exports.getRouteByID = function (req, res) {
  Route.getRouteByID(req.params.id, function (err, result) {
    if (err) {
      res.json(err);
    }
    else {
      res.json(result);
    }
  });
};

module.exports.addRoute = function (req, res) {
  Route.addRoute(req.body, function (err, result) {
    if (err) {
      res.json(err);
    }
    else {
      res.json(result);
    }
  });
};

module.exports.deleteRoute = function (req, res) {
  Route.deleteRoute(req.params.id, function (err, result) {
    if (err) {
      res.json(err);
    }
    else {
      res.json(result);
    }
  });
};

