var datetime = require('fs');
var mysql      = require('mysql');
var db = require('./db');


//////////////////////////////////////////////////////////////////////////////
// Get muster records from the attendance data (where EventsType=mustering) //
//////////////////////////////////////////////////////////////////////////////
module.exports.getMusterRecords = function(id, callback){

    //get a connection using the common handler in models/db.js
    db.createConnection(function(err,reslt){  
        if (err) {
          console.log('Error while performing common connect query: ' + err);
          callback(err, null);
        }else{
          //process the i/o after successful connect.  Connection object returned in callback
          var connection = reslt;

          var strSQL =  'SELECT * FROM attendance where EventID='+id;
          connection.query(strSQL, function(err, rows, fields) {
               if (!err) {
                //feb--send back the results via callback (cant 'return results' from asynch fucntions, have to use calllback)
                  //var array=[];
                  //rows.forEach(function(item) {
                     // array.push(item.clientSWID);
                   // });
                  connection.end();
                  callback(null, rows);


                  }else{
                      console.log('error with the select mustering query');
                      connection.end();
                      callback(err, rows);
                    }
                });
        }
    });
        
};


//////////////////////////////////////////////////////////////////////////////
// Get one muster record from the events table (where EventsType=mustering) //
//////////////////////////////////////////////////////////////////////////////
module.exports.getOneMusterRecord = function(id, callback){

    //get a connection using the common handler in models/db.js
    db.createConnection(function(err,reslt){  
        if (err) {
          console.log('Error while performing common connect query: ' + err);
          callback(err, null);
        }else{
          //process the i/o after successful connect.  Connection object returned in callback
          var connection = reslt;

          var strSQL =  'SELECT * FROM events where EventID='+id;
          connection.query(strSQL, function(err, rows, fields) {
               if (!err) {
                
                  connection.end();
                  callback(null, rows);

                  }else{
                      console.log('error with the select mustering query');
                      connection.end();
                      callback(err, rows);
                    }
                });
        }
    });
        
};

//////////////////////////////////////////////////////////////////////////////
// Get muster records from the attendance data (where EventsType=mustering) //
//////////////////////////////////////////////////////////////////////////////
module.exports.getMusterCounts = function(id, callback){

    //get a connection using the common handler in models/db.js
    db.createConnection(function(err,reslt){  
        if (err) {
          console.log('Error while performing common connect query: ' + err);
          callback(err, null);
        }else{
          //process the i/o after successful connect.  Connection object returned in callback
          var connection = reslt;

          //In order to sort the muster records by the device that scanned them, select based on MobSSOperator, which now contains
          //the Device Auth Code (as per 324 app changes)
          var strSQL = 'SELECT MobSSOperator,COUNT(*) as count FROM attendance WHERE EventID='+id+' GROUP BY MobSSOperator ORDER BY count DESC';
          connection.query(strSQL, function(err, rows, fields) {
               if (!err) {
                //feb--send back the results via callback (cant 'return results' from asynch fucntions, have to use calllback)
                var devAuthCode = "" 
                var resultsArray = rows
                var strSQL1 = 'SELECT PointID, Lat, Lng, Description, DeviceAuthCode FROM musterPoint';
                connection.query(strSQL1, function(err, result3) {
                     if (!err) {
                      // Loop through the muster point array and match the count array
                      for (var i=0; i < rows.length; i++) {
            
                          //console.log('whats the array value  ' + JSON.stringify(resEvacs[i].iClassNumber)); 
                          //console.log('whats the muster array length  ' + JSON.stringify(resz1.length)); 
                          
                          for (var j=0; j < result3.length; j++) {
                            
                              if (result3[j].DeviceAuthCode==rows[i].MobSSOperator) {
                                console.log('ever getting here?? ') 
                                resultsArray[i].PointID = result3[j].PointID;
                                resultsArray[i].Description = result3[j].Description;
                                resultsArray[i].Lat = result3[j].Lat;
                                resultsArray[i].Lng = result3[j].Lng;
                                
                                }
                              
                          }
                      }

                        connection.end();
                        callback(null, resultsArray);
 
                      }else{
                       // resultsArray[k].MusterPoint = "Unassigned"
                       // resultsArray[k].Description = "N/A"
                      }
                  });

                     
                }else{
                      //

                     }
                  
                });
                    
              };
          });         
        
};


////////////////////////////////////////////////////////////////
// FUTURE implementation using the dedicated mustering tables //
////////////////////////////////////////////////////////////////
module.exports.getMusterRecords_FUTURE = function(id, zone, callback){

    //get a connection using the common handler in models/db.js
    db.createConnection(function(err,reslt){  
        if (err) {
          console.log('Error while pErforming common connect query: ' + err);
          callback(err, null);
        }else{
          //process the i/o after successful connect.  Connection object returned in callback
          var connection = reslt;
          console.log('here is the connnection '+reslt.threadId);

          var strSQL =  'SELECT * FROM muster where musterID='+id+' and zone='+zone;
          connection.query(strSQL, function(err, rows, fields) {
               if (!err) {
                //feb--send back the results via callback (cant 'return results' from asynch fucntions, have to use calllback)
                  //var array=[];
                  //rows.forEach(function(item) {
                     // array.push(item.clientSWID);
                   // });
                  console.log('results of join'+JSON.stringify(rows));
                  connection.end();
                  callback(null, rows);


                  }else{
                      console.log('error with the max query');
                      connection.end();
                      callback(err, rows);
                    }
                });
        }
    });
        
};


