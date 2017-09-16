//feb--lots of console.log stuff here for debugging purposes

var mysql = require('mysql');
var fs  = require('fs');
var csvParser = require('csv-parse');
var path = require( 'path' );
var datetime = require('./datetime');
var muster = require('../models/muster');
var evacuation = require('../models/evacuation');
var db = require('../models/db');



// handler for processing csv file ingest submit request
module.exports.musterHome = function(req, res) {
	sess=req.session;
    // don't let nameless people view the dashboard, redirect them back to the homepage
    if (typeof sess.username == 'undefined') res.redirect('/');
    else {

      //get a connection using the common handler in models/db.js
      db.createConnection(function(err,reslt){  
          if (err) {
            
            callback(err, null);
          }else{
            //process the i/o after successful connect.  Connection object returned in callback
            var connection = reslt;
            console.log('here is the connnection '+reslt.threadId);

            // Mustering Phase 1 resuses EVENTS. mustermaster table unused as of 5.2.3
            var _sqlQ = "SELECT * FROM events where EventsType='mustering'";
            //var _sqlQ = "SELECT * FROM musterMaster";

            connection.query(_sqlQ, function(err, results) {
              //connection.release();
              if(err) { console.log('event query bad'+err); callback(true); return; }

            // show the mustering screen if msuter is enabled in the environment variables
            if (process.env.MUSTER == "ON"){
              res.render('musterHome', { title: 'Command Center', username: req.session.username, results });
            }else{
              res.render('disabled', { title: 'Command Center', username: req.session.username, results });
            }
            });
          }
      });
        //res.render('cardholders', { title: 'Command Center 360 - ' });
    }
};




////////////////////////////////////////////////////////////
// Gets the card scans associated with this muster event  //
////////////////////////////////////////////////////////////

module.exports.musterGetOne = function(req,res) {

 sess=req.session;
    // don't let nameless people view the dashboard, redirect them back to the homepage
    if (typeof sess.username == 'undefined') res.redirect('/');
    else {
      
      //get a connection using the common handler in models/db.js
      db.createConnection(function(err,reslt){  
        if (err) {
          console.log('Error while performing common connect query: ' + err);
          callback(err, null);
        }else{
          //process the i/o after successful connect.  Connection object returned in callback
          var connection = reslt;
          
          // Mustering phase 1 reuses the EVENTS table
          var strSQL = 'SELECT * FROM attendance WHERE EventID='+req.params.musterID;
          var query = connection.query(strSQL, function(err, result) {

          if (err) {
              console.log(err)
              //sess.error = 'There was a problem updating the mobss database: '+err;
              res.render('musterDetail', { title: 'Command Center'});
            } else {
              
              console.log('full set of muster results are: ' + JSON.stringify(result));
              var musterID=req.params.musterID;
              var musterName="test";
              if(result.length>0){
                musterID = result[0].EventID;
                musterName = result[0].EventName;
              }
              
              res.render('musterDetail', { title: 'Command Center - Muster Detail', results : result, musterID : musterID, musterName : musterName});
            }
          });//feb--end of connection.query
        }
      });    
    };
}; //feb--end of post handler




//////////////////////
// Add a new muster //
//////////////////////

exports.musterAdd = function(req, res) {
  sess=req.session;
    // don't let nameless people view the dashboard, redirect them back to the homepage
    if (typeof sess.username == 'undefined') res.redirect('/');
    else {

    var name = req.query.name;
    // show the mustering screen if msuter is enabled in the environment variables
    if (process.env.MUSTER == "ON"){
      res.render('musterAdd', { title: 'Command Center'});            
    }else{
      res.render('disabled', { title: 'Command Center', username: req.session.username});
    }
 };
};


//////////////////////////////////////////////////////////////
// handler for posting a new muster to the EVENT table      //
// This is Phase 1 of  mustering -- reusing the attendance  //
// functionality in the App                                 //
//////////////////////////////////////////////////////////////
exports.musterPostDatabase = function(req,res) {

  //get a connection using the common handler in models/db.js
    db.createConnection(function(err,reslt){  
        if (err) {
          console.log('Error while performing common connect query: ' + err);
          callback(err, null);
        }else{
          //process the i/o after successful connect.  Connection object returned in callback
          var connection = reslt;

          var buildEventQuery = (function() {
                      var insertEvent = function(field1, field2, field3, field4, field5,field6,field7) {
              
                      var _eventName = field1;
                      var _dateTime = field2;
                      var _locationName = field3;
                      var _sponsorName = field4;
                      var _duration = field5;
                      var _latitude= null;
                      var _longitude= null;
                      var _recordStatus=null;
                      var _invitationListID =0;

                      var _comments = field6;
                      //var _updateTime = new Date();
                      var _d = new Date();
                      var _t = _d.getTime(); 
                      var _updateTime = _t;
                      var _eventsType = field7;
                      console.log('here is updateTIme  '+_updateTime);
                      
                      var _qFields = '(EventName, EventDateTime, EventLocationName, EventSponsorName, DurationInMins, Latitude, Longitude, RecordStatus, Comments, updateTime, EventsType, InvitationListID)';
                      var _qValues = '("'+_eventName+'", "'+_dateTime+'", "'+_locationName+'", "'+_sponsorName+'", "'+_duration+'", "'+_latitude+'", "'+_longitude+'", "'+_recordStatus+'", "'+_comments+'", "'+_updateTime+'", "'+_eventsType+'", '+_invitationListID+')';                                                      
                      var _qUpdates = 'EventName="'+_eventName+'", EventDateTime="'+_dateTime+'"'+', EventLocationName="'+_locationName+'"'+', EventSponsorName="'+_sponsorName+'"'+', DurationInMins="'+_duration+'"'+', Latitude="'+_latitude+'"'+', Longitude="'+_longitude+'"'+', RecordStatus="'+_recordStatus+'"'+', Comments="'+_comments+'"'+', updateTime="'+_updateTime+'"'+', EventsType="'+_eventsType+'", InvitationListID='+_invitationListID;
                      var parmQuery3 = 'INSERT INTO events '+_qFields+' VALUES ' +_qValues+ ' ON DUPLICATE KEY UPDATE '+_qUpdates;
                      //console.log('parmQuery3= '+parmQuery3);
                      return parmQuery3;
               };
               return {insertEvent : insertEvent};
              })();//feb--end of revealing module

              var _eventDateTime = req.body.eventDate + ' ' + req.body.eventTime;
              //var _eventDateTime = datetime.syncFormatDateStringForDB(eventDateTime);
              console.log('here is the date   '+req.body.eventDate);
              console.log('here is the time  '+req.body.eventTime);
              console.log('here is the EVENTDATETIME  '+_eventDateTime);


              //feb--set the duration field in minutes based on the user input
              var _durationInMinutes = '';
              var _eventType = 'mustering';

              

              console.log('duration in minutes ' + _durationInMinutes);

              var strSQL = buildEventQuery.insertEvent(req.body.musterName, _eventDateTime, req.body.Location, req.body.musterCaptain, _durationInMinutes, req.body.comments, _eventType);
              console.log('POST strSQL= '+ strSQL);  
              var query = connection.query(strSQL, function(err, result) {
                
                 if (err) {
                    console.log(err)
                    sess.error = 'There was a problem updating the mobss database: '+err;
                    connection.end();
                    res.render('musterAdd', { title: 'Command Center'});
                  } else {

                    var eventID =  result.insertId;
                    connection.end();
                    res.status(301).redirect('/musterHome');
                    //res.render('inviteLists', { title: 'Command Center', eventID : lastInsertID});
                  }
              });//feb--end of connection.query
          

        }
    });
}; //feb--end of post handler


/////////////////////////////////////////////////////////////////////////////////////////////////////////////
//  FUTURE design for mustering that uses separate Muster tables rather than reusing events and attendance //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////
exports.musterPostDatabase_FUTURE = function(req,res) {

  //get a connection using the common handler in models/db.js
    db.createConnection(function(err,reslt){  
        if (err) {
          console.log('Error while pErforming common connect query: ' + err);
          callback(err, null);
        }else{
          //process the i/o after successful connect.  Connection object returned in callback
          var connection = reslt;
          console.log('here is the connnection '+reslt.threadId);

          var buildMusterMasterQuery = (function() {
                    var insertMuster = function(field1, field2, field3, field4, field5,field6,field7) {
    
                      //var _musterID = field1;
                      var _musterName = field1;
                      var _Location = field2;
                      var _dateTime = field3;
                      var _musterCaptain = field4;
                      var _Status= field5;
                      var _Type= field6;
                      var _Zones=field7;

                      //var _comments = field6;
                      //var _updateTime = new Date();
                      //var _eventsType = field7;
                      //console.log('here is updateTIme  '+_updateTime);
                      
                      var _qFields = '(musterName, Location, dateTime, musterCaptain, Status, Type, Zones)';
                      var _qValues = '("'+_musterName+'", "'+_Location+'", "'+_dateTime+'", "'+_musterCaptain+'", "'+_Status+'", "'+_Type+'", "'+_Zones+'")';                                                      
                      var _qUpdates = 'musterName="'+_musterName+'", Location="'+_Location+'"'+', dateTime="'+_dateTime+'"'+', musterCaptain="'+_musterCaptain+'"'+', Status="'+_Status+'"'+', Type="'+_Type+'"'+', Zones="'+_Zones+'"';
                      var parmQuery3 = 'INSERT INTO musterMaster '+_qFields+' VALUES ' +_qValues+ ' ON DUPLICATE KEY UPDATE '+_qUpdates;
                      //console.log('parmQuery3= '+parmQuery3);
                      return parmQuery3;
               };
               return {insertMuster : insertMuster};
              })();//feb--end of revealing module

              var strSQL = buildMusterMasterQuery.insertMuster(req.body.musterName, req.body.Location, req.body.eventDate, req.body.musterCaptain, req.body.Status, req.body.Type, req.body.Zones);
              console.log('POST strSQL= '+ strSQL);  
              var query = connection.query(strSQL, function(err, result) {

                              // INSERT INTO Users (id, weight, desiredWeight) VALUES(1, 160, 145) ON DUPLICATE KEY UPDATE weight=160, desiredWeight=145
               // Neat!
                            //if (err) throw error;
                             if (err) {
                                console.log(err)
                                sess.error = 'There was a problem posting the mobss database: '+err;
                                connection.end();
                                res.render('eventAdd', { title: 'Command Center 360'});
                              } else {
                                //console.log(err);
                                connection.end();
                                res.redirect('/musterHome');
                            };
                            });//feb--end of connection.query
        }
    });
}; //feb--end of post handler


///////////////////////////////////////////////////////////////
// Live muster screen                                        //
///////////////////////////////////////////////////////////////
exports.musterLive= function(req, res) {
  sess = req.session;
  sess.time = '';
    // don't let nameless people view the dashboard, redirect them back to the homepage
    if (typeof sess.username == 'undefined') {
      res.redirect('/');
    }else{
    
    /**
     * 1. Get the attendance records for this event (may need to differentiate between check in and check out)
     * 2. Format an array, one entry for each device in the attendance records, with total scanned in
     * 3. Get the evactuation list and biuld an array for those who dont have yet have attendance records
     *
     */
    muster.getMusterRecords(req.params.musterID, function(err, resz1){ 
    if (err) {
      console.log('Error while performing query: ' + err);
    }
    else {
        // Get the muster counts per device
        muster.getMusterCounts(req.params.musterID, function(err, resz2){ 
        if (err) {
          console.log('Error while performing query: ' + err);
        }
        else {

         
        evacuation.getEvacuationList(function(err, resEvacs){ 
         if (err) {
          console.log('Error while performing get evac records: ' + err);
          }
          else {

          // loop through the evac array and remove entry if badgeId record exists in the muster array 
          console.log('whats the array length  ' + JSON.stringify(resEvacs.length));
          //console.log('whats the array value  ' + JSON.stringify(resEvacs[0].iClassNumber));
          var origEvacLength = resEvacs.length;
          var resEvacDisplay = resEvacs
          var resTotalScanned = resz1.length
          
          
          // attn: Have to deal with the case where the  there are two attendance records for the event that 
          // have the same iClassNumber.  if splice from the array when first match is found, then
          // It remove from the array
          for (var i=0; i < resEvacs.length; i++) {
            
            console.log('whats the array value  ' + JSON.stringify(resEvacs[i].iClassNumber)); 
            console.log('whats the muster array length  ' + JSON.stringify(resz1.length)); 
            
            for (var j=0; j < resz1.length; j++) {
                var intOfString = parseInt(resz1[j].iClassNumber); 
                console.log('the two values '+ intOfString + ' '+resEvacs[i].iClassNumber);
                if (intOfString==resEvacs[i].iClassNumber) {
                  console.log('ever getting here?? ') 
                  resEvacs.splice(i,1);
                  
            }
                
            }
          }
      
          // to assist making the progress bars variable, carry both a number and the number+% in array

          var progress = [{
              statusPicture1:'status_Red.png',
              progress1 : '16%'
              },
              {statusPicture2:'status_Orange.png',
              progress2 : '66%'
              },
              {statusPicture3:'status_Red.png',
              progress3 : '6%'
              },
              {statusPicture4:'status_Green.png',
              progress4 : '100%'
              },
              {statusPicture5:'status_Red.png',
              progress5 : '36%'
              },
              {statusPicture6:'status_Orange.png',
              progress6 : '76%'
              }];

          console.log('AGAIN');
          var missingCount = resEvacs.length;
          var overallProg = (origEvacLength - missingCount) / origEvacLength * 100;
          console.log('overall progress is '+overallProg)
          var overallProgRound = overallProg.toFixed(0);
          var overallProgress = overallProg.toFixed(0)+'%';
          statusBar="danger";

          // show the mustering screen if msuter is enabled in the environment variables
          if (process.env.MUSTER == "ON"){
            res.render('musterLive', { title: 'Command Center - Live Muster', statusBar : statusBar, overallProgress : overallProgress, overallProgRound : overallProgRound, missingCount : missingCount, progress : progress, username: req.session.username, resz1 : resz1, resz2 : resz2, resEvacs : resEvacs, resTotalScanned});
          }else{
            res.render('disabled', { title: 'Command Center', username: req.session.username});
          }
        }
      });  //end of evac
     }
   });
    } // if else first get muster
  });
      }
     
    }; //end of handler


///////////////////////////////////////////////////////////////
// FUTURE live muster screen that will use the muster tables //
///////////////////////////////////////////////////////////////
exports.musterLive_FUTURE= function(req, res) {
  sess = req.session;
  sess.time = '';
    // don't let nameless people view the dashboard, redirect them back to the homepage
    if (typeof sess.username == 'undefined') {
      res.redirect('/');
    }else{
    
    muster.getMusterRecords(req.params.musterID, '1', function(err, resz1){ // begin of gets
    if (err) {
      console.log('Error while performing query: ' + err);
    }
    else {

      muster.getMusterRecords(req.params.musterID, '2', function(err, resz2){ 
      if (err) {
        console.log('Error while performing query: ' + err);
      }
      else {
      
        muster.getMusterRecords(req.params.musterID,'3', function(err, resz3){ 
          if (err) {
        console.log('Error while performing query: ' + err);
         }
         else {
            evacuation.getEvacuationList(function(err, resEvacs){ 
             if (err) {
              console.log('Error while performing get evac records: ' + err);
              }
              else {

              // loop through the evac array and remove entry if badgeId record exists in the muster array 
              console.log('whats the array length  ' + JSON.stringify(resEvacs.length));
              //console.log('whats the array value  ' + JSON.stringify(resEvacs[0].iClassNumber));
              var origEvacLength = resEvacs.length;
              

              for (var i=0; i < resEvacs.length; i++) {
                
                console.log('whats the array value  ' + JSON.stringify(resEvacs[i].iClassNumber)); 
                console.log('whats the muster array length  ' + JSON.stringify(resz3.length)); 
                
                for (var j=0; j < resz3.length; j++) {
                    var intOfString = parseInt(resz3[j].BadgeID); 
                    console.log('the two values '+ intOfString + ' '+resEvacs[i].iClassNumber);
                    if (intOfString==resEvacs[i].iClassNumber) {
                      console.log('ever getting here?? ') 
                      resEvacs.splice(i,1);
                      
                }
                
            }
          }
      
          // to assist making the progress bars variable, carry both a number and the number+% in array

          var progress = [{
              statusPicture1:'status_Red.png',
              progress1 : '16%'
              },
              {statusPicture2:'status_Orange.png',
              progress2 : '66%'
              },
              {statusPicture3:'status_Red.png',
              progress3 : '6%'
              },
              {statusPicture4:'status_Green.png',
              progress4 : '100%'
              },
              {statusPicture5:'status_Red.png',
              progress5 : '36%'
              },
              {statusPicture6:'status_Orange.png',
              progress6 : '76%'
              }];

          console.log('AGAIN');
          var missingCount = resEvacs.length;
          var overallProg = (origEvacLength - missingCount) / origEvacLength * 100;
          console.log('overall progress is '+overallProg)
          var overallProgRound = overallProg.toFixed(0);
          var overallProgress = overallProg.toFixed(0)+'%';
          statusBar="danger";


          res.render('musterLive', { title: 'Command Center - Live Muster', statusBar : statusBar, overallProgress : overallProgress, overallProgRound : overallProgRound, missingCount : missingCount, resEvacs : resEvacs, progress : progress, username: req.session.username, resz1 : resz1, resz2 : resz2, resz3 : resz3});
        }
      });
        } // if else last get muster
      });
      } // if else second get muster
    });
    } // if else third get muster
  });
      }
     
    }; //end of handler


/////////////////////////////////////////////////
// List mustering zones                        //
/////////////////////////////////////////////////
exports.musterPointHome = function(req, res) {
  sess=req.session;
  // initializes the success/error messages for the report generation
  // ..so that messages are removed after leaving and re-entering the attendance ascreen
  sess.rptSuccess=null;
  sess.rptError=null;

     // don't let nameless people view the dashboard, redirect them back to the homepage
    if (typeof sess.username == 'undefined') res.redirect('/');
    else {

        //feb--connect to the database, performa query to get all rows from people and send that data to 
        //--to be rendered as a table in Jade
        //feb- we have user entry at this point and so setting up the credentials here
       //get a connection using the common handler in models/db.js
        db.createConnection(function(err,reslt){  
            if (err) {
              callback(err, null);
            }else{
              //process the i/o after successful connect.  Connection object returned in callback
              var connection = reslt;

              var _sqlQ = "SELECT * FROM musterpoint";
              connection.query(_sqlQ, function(err, results) {
                //connection.release();
                if(err) { console.log('musterpoint query error : '+err); connection.end(); callback(true); return; }
             
              connection.end()

              res.render('musterPoints', { title: 'Command Center', username: req.session.username, results });
              });
            }
        });
    }
};



/////////////////////////////////////////////////
// Add a mustering zone and associate a device //
/////////////////////////////////////////////////
exports.musterPointAdd = function(req, res) {
  sess=req.session;
    // don't let nameless people view the dashboard, redirect them back to the homepage
    if (typeof sess.username == 'undefined') res.redirect('/');
    else {

    // show the mustering screen if msuter is enabled in the environment variables
          if (process.env.MUSTER == "ON"){
            res.render('musterPointAdd', { title: 'Command Center'});
          }else{
            res.render('disabled', { title: 'Command Center', username: req.session.username});
          }
 };
};


////////////////////////////////////////////////////////////
// Create muster zone record and move to device list page //
////////////////////////////////////////////////////////////
exports.musterPointPostDatabase = function(req,res) {

//get a connection using the common handler in models/db.js
    db.createConnection(function(err,reslt){  
        if (err) {
          console.log('Error while performing common connect query: ' + err);
          callback(err, null);
        }else{
          //process the i/o after successful connect.  Connection object returned in callback
          var connection = reslt;

          var buildZoneQuery = (function() {
                var insertZone = function(field1, field2, field3, field4, field5,field6,field7, field8, field9) {
        
                var _pointID = field1;
                var _lat= field2;
                var _lng = field3;
                var _description = field4;
                var _region = field5;
                var _campus= field6;
                var _building=field7;
                var _Location=field8;
                var _warden=field9
                //set the deviceAuthCode to "0" for now.  Device can be associated with zone from a list after the NEXT button is pressed 
                var _deviceAuthCode ='0';

               
                
                var _qFields = '(PointID, lat, lng, Description, Region, Campus, Building, Location, Warden , DeviceAuthCode)';
                var _qValues = '("'+_pointID+'", "'+_lat+'", "'+_lng+'", "'+_description+'", "'+_region+'", "'+_campus+'", "'+_building+'", "'+_Location+'", "'+_warden+'", "'+_deviceAuthCode+'")';                                                      
                var parmQuery = 'INSERT INTO musterpoint '+_qFields+' VALUES ' +_qValues
                //console.log('parmQuery3= '+parmQuery3);
                return parmQuery;
               };
               return {insertZone : insertZone};
              })();//feb--end of revealing module
            

              var strSQL = buildZoneQuery.insertZone(req.body.pointID, req.body.lat, req.body.lng, req.body.description, req.body.region, req.body.campus, req.body.building, req.body.location,req.body.warden);
              console.log('POST strSQL= '+ strSQL);  
              var query = connection.query(strSQL, function(err, result) {
                
                 if (err) {
                    console.log(err)
                    sess.error = 'There was a problem updating the mobss database: '+err;
                    connection.end();
                    res.render('musterPointAdd', { title: 'Command Center 360'});
                  } else {
                    //console.log(err);
                    console.log('INSERT  ID????'+result.insertId);

                    var eventID =  result.insertId;
                    pointID = req.body.pointID
                    connection.end();
                    res.status(301).redirect('/devicePointAdd/'+pointID);
                    //res.render('inviteLists', { title: 'Command Center', eventID : lastInsertID});
                  }
              });//feb--end of connection.query
        }
    });

}; //feb--end of post handler

//////////////////////////////////////////////////////////////////////////////////////
// Show the device list so that the user can associate a device with a muster point //
//////////////////////////////////////////////////////////////////////////////////////
exports.deviceListForPoint = function(req, res) {

  sess=req.session;
  sess.rptError =null;
  sess.rptSuccess =null;
    // don't let nameless people view the dashboard, redirect them back to the homepage
    if (typeof sess.username == 'undefined') res.redirect('/');
    else {

      //get a connection using the common handler in models/db.js
     db.createConnection(function(err,reslt){  
        if (err) {
          console.log('Error while performing common connect query: ' + err);
          callback(err, null);
        }else{
          //process the i/o after successful connect.  Connection object returned in callback
          var connection = reslt;
          console.log('here is the connnection '+reslt.threadId);


          var _sqlQ = "SELECT * FROM deviceheader where CurrentStatus='1'";
          connection.query(_sqlQ, function(err, results) {
            //connection.release();
            if(err) { console.log('device query bad'+err); callback(true); connection.end(); return; }
          
            connection.end();
            res.render('devicePointAdd', { title: 'Command Center', username: req.session.username, pointID : req.params.pointID, results });
          });
        } 
      });

        //res.render('cardholders', { title: 'Command Center 360 - ' });
    }
};
//////////////////////////////////////////////////////////////////////////
// Post the device to the zone after it has been selected from the list //
//////////////////////////////////////////////////////////////////////////
exports.deviceAddForPoint = function(req, res) {

  sess=req.session;
    var name = req.query.name;
  console.log('here are the PARAMS for the UPDATE '+req.params.AuthCode+' '+req.params.pointID);

 //get a connection using the common handler in models/db.js
    db.createConnection(function(err,reslt){  
        if (err) {
          console.log('Error while performing common connect query: ' + err);
          callback(err, null);
        }else{
          //process the i/o after successful connect.  Connection object returned in callback
          var connection = reslt;

          /**
           * When an event is added with no invite list, the app complans
           * it is not getting enough felds (12 instead of 13), and the server
           * side db shows NULL in a different way than the other fields
           *
           */
          var _authCode = req.params.AuthCode
          //var _invitationListID = 0;

          //console.log('the parm '+JSON.stringify(req.params.InvitationListID))
          //if (req.params.InvitationListID ==" " || req.params.InvitationListID ==undefined){_invitationListID = 0}else{_invitationListID = req.params.InvitationListID}

              var strSQL = 'UPDATE musterpoint SET DeviceAuthCode="'+_authCode+'" WHERE PointID="'+req.params.pointID+'"';
              console.log('update musterpoint strSQL= '+ strSQL);  

              var query = connection.query(strSQL, function(err, result) {

                 if (err) {
                    console.log(err)
                    sess.error = 'There was a problem updating the mobss database: '+err;
                    connection.end();
                    res.redirect('/musterPoints');
                  } else {
                    //console.log(err);
                    connection.end();
                    sess.success = 'New device attached for this zone'; 
                    res.redirect('/musterPoints');
                };
                });//feb--end of connection.query
        }
    });
   // res.render('/events', { title: 'Command Center 360 - Event List'});
};

/////////////////////////////////
// Get a muster point for edit //
/////////////////////////////////
module.exports.musterPointGetForModify = function(req,res) {

 sess=req.session;
    // don't let nameless people view the dashboard, redirect them back to the homepage
    if (typeof sess.username == 'undefined') res.redirect('/');
    else {

  //get a connection using the common handler in models/db.js
    db.createConnection(function(err,reslt){  
        if (err) {
          console.log('Error while performing common connect query: ' + err);
          callback(err, null);
        }else{
          //process the i/o after successful connect.  Connection object returned in callback
          var connection = reslt;

          var strSQL = "SELECT * FROM musterpoint WHERE PointID='"+req.params.pointID+"'";
          console.log(strSQL)
          var query = connection.query(strSQL, function(err, result) {

                 if (err) {
                    console.log(err)
                    connection.end();
                    //sess.error = 'There was a problem updating the mobss database: '+err;
                    res.render('MusterPoints', { title: 'Command Center'});
                  } else {
                   console.log(JSON.stringify(result))
                    res.render('musterPointModify', { title: 'Command Center', result});
                    
                };
                });//feb--end of connection.query
        }
    });
};
}; // end of handler

////////////////////////////////////////////////////////////
// Create muster zone record and move to device list page //
////////////////////////////////////////////////////////////
exports.musterPointUpdateOne = function(req,res) {

//get a connection using the common handler in models/db.js
    db.createConnection(function(err,reslt){  
        if (err) {
          console.log('Error while performing common connect query: ' + err);
          callback(err, null);
        }else{
          //process the i/o after successful connect.  Connection object returned in callback
          var connection = reslt;

          var buildPointQuery = (function() {
                var updatePoint = function(field1, field2, field3, field4, field5,field6,field7, field8, field9, field10) {
        
                var _pointID = field1;
                var _lat= field2;
                var _lng = field3;
                var _description = field4;
                var _region = field5;
                var _campus= field6;
                var _building=field7;
                var _Location=field8;
                var _warden=field9
                //set the deviceAuthCode to "0" for now.  Device can be associated with zone from a list after the NEXT button is pressed 
                var _deviceAuthCode =field10;

               
                
                var _qFields = '(PointID, lat, lng, Description, Region, Campus, Building, Location, Warden , DeviceAuthCode)';
                var _qValues = '("'+_pointID+'", "'+_lat+'", "'+_lng+'", "'+_description+'", "'+_region+'", "'+_campus+'", "'+_building+'", "'+_Location+'", "'+_warden+'", "'+_deviceAuthCode+'")';                                                      
                var _qUpdates = 'PointID="'+_pointID+'", Lat="'+_lat+'"'+', Lng="'+_lng+'"'+', Description="'+_description+'"'+', Region="'+_region+'"'+', Campus="'+_campus+'"'+', Building="'+_building+'"'+', Location="'+_location+'"'+', Warden="'+_warden+'"';
                var parmQuery = "UPDATE musterpoint SET "+_qUpdates+" WHERE PointID='"+_pointID+"'";
                //console.log('parmQuery3= '+parmQuery3);
                return parmQuery;
               };
               return {insertZone : insertZone};
              })();//feb--end of revealing module
            

              var strSQL = buildPointQuery.insertZone(req.body.pointID, req.body.lat, req.body.lng, req.body.description, req.body.region, req.body.campus, req.body.building, req.body.location,req.body.warden);
              console.log('POST strSQL= '+ strSQL);  
              var query = connection.query(strSQL, function(err, result) {
                
                 if (err) {
                    console.log(err)
                    sess.error = 'There was a problem updating the mobss database: '+err;
                    connection.end();
                    res.render('musterPoints', { title: 'Command Center'});
                  } else {
                   
                   var invitationListID = '';
                    var strSQL1 =  "SELECT InvitationListID from events where EventID="+req.params.eventID;
                      connection.query(strSQL1, function(err, rows) {
                           if (err) {
                            //feb--send back the results via callback (cant 'return results' from asynch fucntions, have to use calllback)
                            
                              console.log('results of quert'+JSON.stringify(rows));
                              
                              }else{
                                  invitationListID = rows[0].InvitationListID === 0 ? 'No invite list' : rows[0].InvitationListID;
                                   
                            
                                  //res.status(301).redirect('/inviteListsChange/'+req.params.eventID+'/'+req.body.eventName+'/'+invitationListID);
                              }
                            //REgardless of result of InvitationListID lookup, we are heading for the list change screen
                            connection.end();
                            res.status(301).redirect('/inviteListsChange/'+req.params.eventID+'/'+req.body.eventName+'/'+invitationListID);

                            });
                  }
              });//feb--end of connection.query
        }
    });

}; //feb--end of post handler

// handler for processing csv file ingest submit request
exports.musterPointChangeforEvent = function(req, res) {

  sess=req.session;
  sess.rptError =null;
  sess.rptSuccess =null;
    // don't let nameless people view the dashboard, redirect them back to the homepage
    if (typeof sess.username == 'undefined') res.redirect('/');
    else {

      //get a connection using the common handler in models/db.js
     db.createConnection(function(err,reslt){  
        if (err) {
          console.log('Error while performing common connect query: ' + err);
          callback(err, null);
        }else{
          //process the i/o after successful connect.  Connection object returned in callback
          var connection = reslt;


          var _sqlQ = "SELECT * FROM deviceheader";
          connection.query(_sqlQ, function(err, results) {
            //connection.release();
            if(err) { console.log('event query bad'+err); callback(true); connection.end(); return; }
          
            connection.end();
            res.render('musterPointDeviceChange', { title: 'Command Center', username: req.session.username, pointID : req.params.pointID, deviceAuthCode : req.params.deviceAuthCode, results });
          });
        } 
      });

        //res.render('cardholders', { title: 'Command Center 360 - ' });
    }
};
