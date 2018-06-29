var db = require('../models/db');
var InviteListModel = require('../models/InviteListModel');

exports.createInviteListHome = function (req, res) {
  sess = req.session;
  // don't let nameless people view the dashboard, redirect them back to the homepage
  if (typeof sess.username == 'undefined') res.redirect('/');
  else {

    db.createConnection(function (err, result) {
      if (err) {
        callback(err, null);
      } else {
        //process the i/o after successful connect.  Connection object returned in callback
        var connection = result;

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

exports.postInviteList = function (req, res) {
  InviteListModel.postInviteList(req.body, function (err, postInviteListResult) {
    if (err) {
      res.json(err);
    } else {
      res.json(postInviteListResult);
    }
  })
}

exports.postInvitee = function (req, res) {
  InviteListModel.postInvitee(req.body, function (err, postInviteeResult) {
    if (err) {
      res.json(err);
    } else {
      res.json(postInviteeResult);
    }
  })
}

module.exports.getLastInviteList = function (req, res) {
  InviteListModel.getLastInviteList(function (err, getLastInviteListResult) {
    if (err) {
      res.json(err);
    }
    else {
      res.json(getLastInviteListResult);
    }
  });
};

exports.renderPage = function (req, res) {
  sess = req.session;
  // don't let nameless people view the dashboard, redirect them back to the homepage
  if (typeof sess.username == 'undefined') res.redirect('/');
  else {

    db.createConnection(function (err, result) {
      if (err) {
        callback(err, null);
      } else {
        var connection = result;

        var _sqlQ = "SELECT * FROM people";
        connection.query(_sqlQ, function (err, results) {
          if (err) { console.log('cardholder query bad' + err); callback(true); return; }

          if (results.length < 5000) {
            //regular Js datatables high functionality search and pagination  
            res.render('InviteListCreatorView', { title: 'Command Center - Create Invite List', username: req.session.username, results });
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

exports.renderInviteCreator = function (req,res){

  sess = req.session;
  // don't let nameless people view the dashboard, redirect them back to the homepage
  if (typeof sess.username == 'undefined') res.redirect('/');
  else {
    InviteListModel.getGroups(req.body, function (err, getGetGroupsResult){
      if (err){
        res.end()
      } else {
        InviteListModel.getPeopleByGroup(req.body, function (err, getPeopleByGroupResults){
          if (err) {
  
          } else {
            res.render('InviteListCreatorView', { title: 'Command Center - Create Invite List', username: req.session.username, results });
          }
        })
      }
  
    })
  }


}