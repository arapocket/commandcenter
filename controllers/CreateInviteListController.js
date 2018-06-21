var db = require('../models/db');
var CreateInviteListModel = require('../../models/CreateInviteListModel');

exports.createInviteListHome = function (req, res) {
  sess = req.session;
      // don't let nameless people view the dashboard, redirect them back to the homepage
      if (typeof sess.username == 'undefined') res.redirect('/');
      else {

    db.createConnection(function (err, reslt) {
      if (err) {
        callback(err, null);
      } else {
        //process the i/o after successful connect.  Connection object returned in callback
        var connection = reslt;

        var _sqlQ = "SELECT * FROM people";
        connection.query(_sqlQ, function (err, results) {
          //connection.release();
          if (err) { console.log('cardholder query bad' + err); callback(true); return; }

          //use alternate views based on data load. Using JS datatables, HTML must load comletely before
          //the page renders
          if (results.length < 5000) {
            //regular Js datatables high functionality search and pagination  
            res.render('CreateInviteListView', { title: 'Command Center - Create Invite List', username: req.session.username, results });
          } else {
            //plain table and browser search only  
            res.render('cardholdersLarge', { title: 'Command Center - Cardholders', username: req.session.username, results });
          }
        });
      }
    });
            //res.render('cardholders', { title: 'Command Center 360 - ' });
      }
};

exports.createInviteList = function (req, res) {
  sess = req.session;
      // don't let nameless people view the dashboard, redirect them back to the homepage
      if (typeof sess.username == 'undefined') res.redirect('/');
      else {
    CreateInviteListModel.createInviteList(req.body, function (err, createInviteListResult) {
      if (err) {
        res.json(err);
      }
      else {
        res.json(createInviteListResult);
      }
    });
      }
};

