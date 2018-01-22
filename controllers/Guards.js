var express = require('express');
var router = express.Router();
var Guard = require('../models/Guard');



module.exports.getAllGuards = function (req, res) {
  Guard.getAllGuards(function (err, result) {
    if (err) {
      res.json(err);
    }
    else {
      res.json(result);
    }
  });
};

exports.getGuardByID = function (req, res) {
  Guard.getGuardByID(req.params.id, function (err, result) {
    if (err) {
      res.json(err);
    }
    else {
      res.json(result);
    }
  }); 
};

exports.addGuard = function (req, res) {
  Guard.addGuard(req.body,function (err, result) {
    if (err) {
      res.json(err);
    }
    else {
      res.json(req.body);
    }
  });
};


exports.guardAdd = function(req, res) {
  sess=req.session;
    // don't let nameless people view the dashboard, redirect them back to the homepage
    if (typeof sess.username == 'undefined') res.redirect('/');
    else {

    var name = req.query.name;
    /**
     * Only show the users screen if user has privilege
     */
    if (sess.userType == '2'){
        res.render('guardAdd', { title: 'Command Center'});
      } else {
        res.render('Unauthorized', { title: 'Command Center'});
      }
 };
};

exports.deleteGuard = function (req, res) {
  Guard.deleteGuard(req.params.id, function (err, result) {
    if (err) {
      res.json(err);
    }
    else {
      res.json(result);
    }
  });
};

exports.updateGuard = function (req, res) {
  Guard.updateGuard(req.body, function (err, result) {
    if (err) {
      res.json(err);
    }
    else {
      res.json(result);
    }
  });
};





