const { fork } = require('child_process');
var fs = require('fs');
var path = require('path');
var sharp = require('sharp');

var moveFrom = req.body.directorySource;

var moveTo = "./public/photosforreader";

console.log('compute.js called');

    let sum = 0;
    for (let i = 0; i < 1e9; i++) {
      sum += i;
    };
    console.log('logging sum');
    console.log(sum);
  
  if (process.send) {
    process.send(sum);
  }

  
  process.on('message', message => {
    // console.log('message from parent:', message);
  
    message.files.forEach(function (file, index) {
      var fromPath = path.join(moveFrom, file);
      var toPath = path.join(moveTo, file);

      fs.stat(fromPath, function (error, stat) {
        if (error) {
          console.error("Error stating file.", error);
          return;
        }

        if (stat.isFile()) {
          // console.log( "'%s' is a file.", fromPath );
        }

        else if (stat.isDirectory()) {
          // console.log( "'%s' is a directory.", fromPath );
        }

        // was 200, 300.  changed to smaller size 7/7/17  
        // sharp(fromPath).resize(100, 150).toFile(toPath, function (err) {
        //   if (err) {
        //     console.log("One of the files is not in expected format (.jpg) " + err);
        //     return;
        //   }
        // });

      });
    });




    
  });