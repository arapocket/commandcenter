const { fork } = require('child_process');


//feb--lots of console.log stuff here for debugging purposes

var mysql = require('mysql');
var fs = require('fs');
var csvParser = require('csv-parse');
var path = require('path');
// var process = require( "process" ); -- I removed this as i believe it is globally availble object
//feb-- image processing
var sharp = require('sharp');
var db = require('../models/db');

//////////////////////////////////////////////////////
//handler for showing the photo ingest page         //
//////////////////////////////////////////////////////
exports.photosHome = function (req, res) {
  sess = req.session;
  sess.photosSuccess = null;
  sess.photosError = null;

  // feb--don't let nameless people view the page, redirect them back to the homepage
  if (typeof sess.username == 'undefined') {
    res.redirect('/');
  } else {



    var name = req.query.name;
    var contents = {
      about: 'Use this screen to select the CSV file containing your exported PACS data.',
      contact: 'Command Center will update the MOBSS database with any changes.'
    };
    //res.render('photos');
    res.render('photos', { title: 'Command Center 5.0' + name, username: sess.username, content: contents[name] });
  };
};

///////////////////////////////////////////////////////////////////
//** handler for processing the photos into the public directory //
///////////////////////////////////////////////////////////////////
exports.photosIngest = function (req, res) {


  console.log('am i getting into the ingest handler');
  sess = req.session;
  // Going to need this to be a user input or a parameter.  User selected from and to but with To showing a default to the
  var moveFrom = req.body.directorySource;

  var moveTo = "./public/photosforreader";

  // Loop through all the files in the source directory
  fs.readdir(moveFrom, function (err, files) {
    if (err) {
      console.error("Could not list the directory.", err);
      sess.photosSuccess = null;
      sess.photosError = 'Directory does not exist or not accessible';
      res.render('photos', { title: 'Command Center 360', username: sess.username, success: sess.photosSuccess, error: sess.photosError });
      //process.exit( 1 );
    } else {

      const fork = require('child_process').fork;
      const program = path.resolve('ProcessImages.js');
      const parameters = [];
      const options = {
        // stdio: [ 'pipe', 'pipe', 'pipe', 'ipc' ]
      };
      const child = fork(program, parameters, options);

      child.on('message', message => {
        console.log('message from child:', message);
        child.send({files: files, moveFrom: moveFrom});
      });



      //feb--finished looping through the directory, so process successful response
      sess.photosSuccess = 'Photos processed successfully';
      sess.photosError = null;
      res.render('photos', { title: 'Command Center 360', username: sess.username, success: sess.photosSuccess });
    }
  });

}; //feb--end of export.photosIngest




///////////////////////////////////////////////////////////////////
//** handler for processing the search of the gallery            //
///////////////////////////////////////////////////////////////////
exports.photoCheckProcess = function (req, res) {
  sess = req.session;
  sess.empSearch = req.body.empIDSearch;
  sess.photoCheckError = null
  sess.photoCheckError1 = null


  if (sess.empSearch == 'undefined' || sess.empSearch == "") {
    res.redirect('/photoCheck');
  } else {
    //var image = '<img src="public/gas.jpg">'

    db.createConnection(function (err, reslt) {
      if (err) {
        console.log('Error while pErforming common connect query: ' + err);
        callback(err, null);
      } else {
        //process the i/o after successful connect.  Connection object returned in callback
        var connection = reslt;
        console.log('here is the connnection ' + reslt.threadId);

        console.log('empSearch is : ' + sess.empSearch);



        var idSQL = 'SELECT * FROM people WHERE LastName = ' + '"' + sess.empSearch + '"';
        connection.query(idSQL, function (err, rows, fields) {
          var _numRows = rows.length;
          console.log('number of rows returned was ' + _numRows);

          // feb-- need to check for an empty set return??
          if (_numRows < 1) {
            console.log('got an error looking for empID');
            sess.photoCheckError = 'No cardholder by that name';
            var imageLast = sess.empSearch;
            var images = []

            connection.end();
            res.render('photoCheck', { title: 'Command Center', images: images, imageLast: imageLast });

          } else {

            /**
             * At least one cardholder exists by that name
             * Show all the photos for people of that name
             */
            var appDir = path.dirname(require.main.filename);
            var photosDir = path.join(appDir, '/public/photosforreader/');
            var images = [];


            for (var i = 0; i < rows.length; i++) {

              if (rows[i].imageName == "") {

                sess.photoCheckError1 = 'A cardholder by that name has no image in the database'
              } else {

                var imageFullname = rows[i].imageName + '.jpg'
                var imageEmpID = sess.empSearch;
                var fromPath = path.join(photosDir, imageFullname);
                console.log('my full path is as follows: ' + fromPath);


                // feb -- check photo file exists & send it to the view for display
                if (fs.existsSync(fromPath)) {

                  console.log('imagename is ' + rows[i].imageName)
                  var imageFile = '/photosforreader/' + rows[i].imageName + '.jpg';
                  var imageLast = rows[i].LastName;
                  var imageEmpID = sess.empSearch;
                  //console.log(sess.error);
                  //sess.photoCheckError = null;

                  //var imagef = 'photos/img.jpg'
                  images.push(imageFile)

                  console.log('imageArray ' + images)


                  console.log('image file full name is : ' + imageFile);
                  console.log('here is the value of the imageEmpID ' + imageEmpID);

                } else {
                  console.log('not found so process the error');   // do the error stuff for a file not found
                  var imageLast = sess.empSearch;

                  sess.photoCheckError = "A cardholder by that name's photo is missing from the directory";
                }
              }

            }
            connection.end();
            res.render('photoCheck', { title: 'Command Center', images, imageLast: imageLast });
          }; // feb--end if-else

        }); // end of database query
      }
    });
  }; // feb--end of if-else

};




///////////////////////////////////////////////////////////
// handler for showing the photo check/Gallery page      //
//////////////////////////////////////////////////////////
/**
 * This is a combination gallery plus search field to find a particular photo.
 * Right now it simply builds an array of the pictures in the photosforreader directory
 * and sends them to the vies for rendering.  The view will immediately start displaying
 * photos while it continues to process the array.
 */
exports.photoCheck = function (req, res) {
  sess = req.session;
  sess.photoCheckError = null;
  sess.photoCheckError1 = null


  // don't let nameless people view the page, redirect them back to the homepage
  if (typeof sess.username == 'undefined') {
    res.redirect('/');
  } else {

    sess.empSearch = req.body.empIDSearch;

    if (typeof sess.empSearch == 'undefined') {

      if (sess.empSearch == undefined)

        /**
         * Get ALL the photos from public/photosforreader/ and put them into an array
         */
        var imageLast = "";
      var imageFile = "";

      var images = [];
      var photoDir = "./public/photosforreader";

      // Loop through all the files in the source directory
      fs.readdir(photoDir, function (err, files) {
        if (err) {
          sess.photosSuccess = null;
          sess.photosError = 'Directory does not exist or not accessible';
          res.render('photos', { title: 'Command Center 360', username: sess.username, success: sess.photosSuccess, error: sess.photosError });
        } else {

          files.forEach(function (file, index) {
            imageFile = '/photosforreader/' + file;

            images.push(imageFile)

          });
          //feb--finished looping through the directory, so process successful response
          sess.photosSuccess = 'Photos processed successfully';
          sess.photosError = null;
          res.render('photoCheck', { title: 'Command Center', images: images, imageLast: imageLast });
        }
      }); //End of the directory address read

    }; //feb--end of if/else test for nameless
  };
}




