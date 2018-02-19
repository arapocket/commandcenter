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


module.exports.getRouteByName = function (req, res) {
  Route.getRouteByName(req.body, function (err, result) {

    console.log('logging req.body from controller ' + JSON.stringify(req.body))

    if (err) {
      res.json(err);
    }
    else {
      res.json(result);
    }
  });
};

module.exports.getCurrentRoutes = function (req, res) {
  Route.getCurrentRoutes(req.params.id, function (err, result) {
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
      Route.updateRoute(req.body, function (err, res) {
        if (res) {
          console.log(res);
        } else {
          console.log(err);
        }

      });
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

module.exports.updateRoute = function (req, res) {
  Route.updateRoute(req.body, function (err, result) {
    if (err) {
      res.json(err);
    }
    else {
      res.json(result);
    }
  });
};

module.exports.disableRoutes = function (req, res) {
  Route.disableRoutes(req.body, function (err, result) {
    if (err) {
      res.json(err);
    }
    else {
      res.json(result);
    }
  });
};

