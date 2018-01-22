var express = require('express');
var router = express.Router();
var Guard = require('../models/Guard');
var db = require('../models/db');


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

module.exports.guardAddToDb = function (req, res) {

  var _guardID =  Math.random().toString(36).substr(2, 9);

  //get a connection using the common handler in models/db.js
  db.createConnection(function (err, reslt) {
    if (err) {
      console.log('Error while performing common connect query: ' + err);
      callback(err, null);
    } else {
      //process the i/o after successful connect.  Connection object returned in callback
      var connection = reslt;

      var buildUserQuery = (function () {
        var insertUser = function (field1, field2, field3, field4, field5, field6, field7) {

          var _userName = field1;
          /**
           * Call common handler to hash the password with 'salt' and store both in db
           */
          var _passData = Guard.saltHashPassword(field2);
          var _password = _passData.hash
          var _rgen = _passData.salt
          console.log('password returned : ' + _password)

          var _lastName = field3;
          var _firstName = field4;
          var _empID = field5;
          var _userEmail = field6;
          var _status = field7;




          /**
          * Use the cmmon date handler to return the timestamp in a more usable
          * format for the database
          */
          var _date = datetime.syncCurrentDateTimeforDB();

          var _qFields = '(UserName, Password, LastName, FirstName, EmpID, UserEmail, Status, UpdateTime, RGen, GuardID)';
          var _qValues = '("' + _userName + '", "' + _password + '", "' + _lastName + '", "' + _firstName + '", "' + _empID + '", "' + _userEmail + '", "' + _status + '", "' + _date + '", "' + _privLevel + '", "' + _rgen + '", "' + _guardID + '")';
          var parmQuery3 = 'INSERT INTO foxwatchusers ' + _qFields + ' VALUES ' + _qValues;
          //console.log('parmQuery3= '+parmQuery3);
          return parmQuery3;
        };
        return { insertUser: insertUser };
      })();//end of revealing module


      //set the status  for database based on the user input
      var _status = '';
      if (req.body.status == 'Active') {
        _status = '1';
      } else if (req.body.status == 'Suspended') {
        _status = '2';
      } else { _status = '3' }

      var strSQL = buildUserQuery.insertUser(req.body.userName, req.body.password, req.body.lastName, req.body.firstName, req.body.empID, req.body.userEmail, _status, _guardID);
      console.log('USER ADD strSQL= ' + strSQL);
      var query = connection.query(strSQL, function (err, result) {

        if (err) {
          console.log(err)
          sess.error = 'There was a problem updating the mobss database: ' + err;
          connection.end();
          res.render('userAdd', { title: 'Command Center 360' });
        } else {

          connection.end();
          res.status(301).redirect('/users');
        }
      });//end of connection.query
    }
  });

}; //end of user post handler


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





