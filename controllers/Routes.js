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
  Route.getRouteByID(function (err, result) {
    if (err) {
      res.json(err);
    }
    else {
      res.json(result);
    }
  });
};

module.exports.addRoute = function (req, res) {
  Route.addRoute(function (err, result) {
    if (err) {
      res.json(err);
    }
    else {
      res.json(result);
    }
  });
};

module.exports.deleteRoute = function (req, res) {
  Route.deleteRoute(function (err, result) {
    if (err) {
      res.json(err);
    }
    else {
      res.json(result);
    }
  });
};

module.exports.updateRoute = function (req, res) {
  Route.updateRoute(function (err, result) {
    if (err) {
      res.json(err);
    }
    else {
      res.json(result);
    }
  });
};