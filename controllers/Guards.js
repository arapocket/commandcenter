var express = require('express');
var router = express.Router();
var Guard = require('../models/Guard');
var db = require('../models/db');
var datetime = require('./datetime');


//////////////////////////////
//   show the list of guards //
//////////////////////////////
module.exports.guardList = function (req, res) {
  sess = req.session;
  // initializes the success/error messages for the report generation
  // ..so that messages are removed after leaving and re-entering the attendance ascreen
  sess.rptSuccess = null;
  sess.rptError = null;

  // don't let nameless people view the dashboard, redirect them back to the homepage
      if (typeof sess.username == 'undefined') res.redirect('/');
      else {

    db.createConnection(function (err, reslt) {
      if (err) {
        callback(err, null);
      } else {
        //process the i/o after successful connect.  Connection object returned in callback
        var connection = reslt;

        var _sqlQ = "SELECT * FROM foxwatchusers";
        connection.query(_sqlQ, function (err, results) {
          if (err) { console.log('user query bad' + err); connection.end(); callback(true); return; }

          connection.end()
          /**
           * Only show the users screen if user has privilege
           * 
           */
          if (sess.userType == '2') {
            res.render('guardlist', { title: 'Command Center', username: req.session.username, results });
          } else {
            res.render('Unauthorized', { title: 'Command Center' });
          }

        });
      }
    });
      }
};


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
          var _qValues = '("' + _userName + '", "' + _password + '", "' + _lastName + '", "' + _firstName + '", "' + _empID + '", "' + _userEmail + '", "' + _status + '", "' + _date +  '", "' + _rgen + '", "' + _guardID + '")';
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
          res.status(301).redirect('/guardlist');
        }
      });//end of connection.query
    }
  });

}; //end of user post handler



module.exports.getGuardByID = function (req, res) {

  sess = req.session;
      // don't let nameless people view the dashboard, redirect them back to the homepage
      if (typeof sess.username == 'undefined') res.redirect('/');
      else {

    //get a connection using the common handler in models/db.js
    db.createConnection(function (err, reslt) {
      if (err) {
        console.log('Error while performing common connect query: ' + err);
        callback(err, null);
      } else {
        //process the i/o after successful connect.  Connection object returned in callback
        var connection = reslt;

        var strSQL = 'SELECT * FROM foxwatchusers WHERE GuardID="' + req.params.guardID + '"';
        console.log('here is the query string' + strSQL);
        var query = connection.query(strSQL, function (err, results) {

          if (err) {
            console.log(err)
            connection.end();
            //sess.error = 'There was a problem updating the mobss database: '+err;
            res.render('guardlist', { title: 'Command Center' });
          } else {
            connection.end();
            res.render('guardModify', { title: 'Command Center', results });


          };
        });//end of connection.query
      }
    });
  };
}; //end of handler




////////////////////////////////////////////////
// Update the datebase with the modifications //
////////////////////////////////////////////////
exports.updateGuard = function (req, res) {
  sess = req.session;
      var name = req.query.name;

  //get a connection using the common handler in models/db.js
  db.createConnection(function (err, reslt) {
    if (err) {
      console.log('Error while performing common connect query: ' + err);
      callback(err, null);
    } else {
      //process the i/o after successful connect.  Connection object returned in callback
      var connection = reslt;

      var buildUserQuery = (function () {
        var updateUser = function (field1, field2, field3, field4, field5, field6) {

          var _userName = field1;
          var _lastName = field2;
          var _firstName = field3;
          var _empID = field4;
          var _userEmail = field5;
          var _status = field6;


          /**
          * Use the cmmon date handler to return the timestamp in a more usable
          * format for the database
          */
          var _date = datetime.syncCurrentDateTimeforDB();


          var _qFields = '(UserName, LastName, FirstName, EmpID, UserEmail, Status, UpdateTime)';
          var _qValues = '("' + _userName + '", "' + _lastName + '", "' + _firstName + '", "' + _empID + '", "' + _userEmail + '", "' + _status + '", "' + _date + '")';
          var _qUpdates = 'UserName="' + _userName + '", LastName="' + _lastName + '"' + ', FirstName="' + _firstName + '"' + ', EmpID="' + _empID + '"' + ', UserEmail="' + _userEmail + '"' + ', Status="' + _status + '"' + ', UpdateTime="' + _date + '"' + '"';
          var parmQuery3 = 'UPDATE foxwatchusers SET ' + _qUpdates + ' WHERE UserName="' + _userName + '"';
          //console.log('parmQuery3= '+parmQuery3);
          return parmQuery3;
        };
        return { updateUser: updateUser };
      })();//end of revealing module

      //set the privilege level for database based on the user input
      var _privLevel = '';
      if (req.body.privLevel == 'User') {
        _privLevel = '1';
      } else if (req.body.privLevel == 'Administrator') {
        _privLevel = '2';
      } else { _privLevel = '3' }

      //set the status  for database based on the user input
      console.log('here is the status ' + req.body.status)

      var _status = '';
      if (req.body.status == 'Active') {
        _status = '1';
      } else if (req.body.status == 'Suspended') {
        _status = '2';
      } else { _status = '3' }

      /**
       * Get the username from request object -- can't retrieve from the read-only "disabled" field
       */

      var strSQL = buildUserQuery.updateUser(req.params.userName, req.body.lastName, req.body.firstName, req.body.empID, req.body.userEmail, _status, _privLevel);

      console.log('update strSQL= ' + strSQL);

      var query = connection.query(strSQL, function (err, result) {

        if (err) {
          console.log(err)
          sess.error = 'There was a problem updating the mobss database: ' + err;
          connection.end();
          res.render('userModify', { title: 'Command Center' });
        } else {
          console.log("successful update")
          connection.end();
          res.status(301).redirect('/users');

        };
      });//feb--end of connection.query
    }
  });
};

////////////////////////////////////////////////
// delete the record from the database        //
////////////////////////////////////////////////
module.exports.deleteGuard = function (req, res) {

  sess = req.session;
      // don't let nameless people view the dashboard, redirect them back to the homepage
      if (typeof sess.username == 'undefined') res.redirect('/');
      else {

    //get a connection using the common handler in models/db.js
    db.createConnection(function (err, reslt) {
      if (err) {
        console.log('Error while performing common connect query: ' + err);
        callback(err, null);
      } else {
        //process the i/o after successful connect.  Connection object returned in callback
        var connection = reslt;

        var strSQL = 'DELETE FROM users WHERE UserName="' + req.params.userName + '"';
        console.log('here is the query string' + strSQL);
        var query = connection.query(strSQL, function (err, results) {

          if (err) {
            console.log(err)
            connection.end();
            //sess.error = 'There was a problem updating the mobss database: '+err;
            res.render('users', { title: 'Command Center' });
          } else {
            connection.end();
            res.status(301).redirect('/users');


          };
        });//end of connection.query
      }
    });
  };
}; //end of handler





