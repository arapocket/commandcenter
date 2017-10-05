var express = require('express');
var router = express.Router();
var GuardLocation = require('../models/GuardLocation');


module.exports.getAllGuardLocations = function (req, res) {

  GuardLocation.getAllGuardLocations(function (err, rows) {

    if (err) {
      res.json(err);
    }
    else {
      
    

/////////////////////////////////////////////////////////////////////////////////////
      
      //////////////////////////// STUFF TO DO IN FOXWATCH          <<< DONE

      //coordinate CurrentLocation  <<< done
      //patrol     CurrentPatrol    <<< done
      
      ////////////////////   CONTROLLER / MODEL WILL DO THESE

      //   coordinate will also check its FK PatrolID's bool to see which coords to display
      //   incident will use its FK PatrolID's bool to see if it should display
      // Q:--------------------> NEED TO FIGURE OUT HOW TO JOIN TABLES?
      // A:--------------------> JUST WRITE A REGULAR JOIN SQL STATEMENT IN ONE MODEL

              /////// then I need to grab the following info from the db
      
      // all the fields with a true value in the boolean
      // grab from guard FirstName, LastName, 
      // grab route and print on map


                    // just do one of these yo
      //GuardLocation.getAllGuardLocations(function (err, rows)
      // need to create it first





    

      res.render('guardlocations', { title: 'Guard Locations', rows: rows });

    }

  });

};

exports.AddGuardLocation = function (req, res) {
  GuardLocation.addGuardLocation(req.body, function (err, loc) {
    if (err) {
      res.json(err);
    }

    else {
      res.render('guardlocations', { title: 'Guard Locations', body: req.body });
    }

  });
}

exports.updateGuardLocation = function (req, res) {



  GuardLocation.updateGuardLocation(req.body, function (err, loc) {

    if (err) {
      res.json(err);
    }

    else {
      res.render('guardlocations', { title: 'Guard Locations', body: req.body });

    }

  });

};


// router.get('/:id?', function (req, res, next) {

// //add this line when you want your res to render a page, with supplied data.
// // res.render('musterLive', { title: 'Command Center', statusBar : statusBar});


//   if (req.params.id) {

//     GuardLocation.getGuardLocationByID(req.params.id, function (err, rows) {

//       if (err) {
//         res.json(err);
//       }
//       else {
//         res.json(rows);


//       }
//     });
//   }
//   else {

//     GuardLocation.getAllGuardLocations(function (err, rows) {

//       if (err) {
//         res.json(err);
//       }
//       else {
//         res.json(rows);
//         res.render('guardlocations', { title: 'Guard Locations', rows});
//       }

//     });
//   }
// });
// router.post('/', function (req, res, next) {

//   GuardLocation.addGuardLocation(req.body, function (err, count) {
//     if (err) {
//       res.json(err);
//     }
//     else {
//       res.json(req.body);//or return count for 1 &amp;amp;amp; 0
//     }
//   });
// });
// router.delete('/:id', function (req, res, next) {

//   GuardLocation.deleteGuardLocation(req.params.id, function (err, count) {

//     if (err) {
//       res.json(err);
//     }
//     else {
//       res.json(count);
//     }

//   });
// });
// router.put('/:id', function (req, res, next) {

//   GuardLocation.updateGuardLocation(req.params.id, req.body, function (err, rows) {

//     if (err) {
//       res.json(err);
//     }
//     else {
//       res.json(rows);
//     }
//   });
// });
// module.exports = router;