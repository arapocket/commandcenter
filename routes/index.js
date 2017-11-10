var express = require('express');
var router = express.Router();
var cc = require('../controllers/cc');
var csv = require('../controllers/csv');
var photos = require('../controllers/photos');
var invites = require('../controllers/invites');
var cardholders = require('../controllers/cardholders');

var badges = require('../controllers/badges');

var events = require('../controllers/events');
var devices = require('../controllers/devices');
var connections = require('../controllers/connections');
var settings = require('../controllers/settings');
var users = require('../controllers/users');



var verify = require('../controllers/verify');
var mustering = require('../controllers/mustering');
var evacuation = require('../controllers/evacuation');
var invites = require('../controllers/invites');

/* GET home page. */
//router.get('/', function(req, res, next) {
//  res.render('index', { title: 'Express' });
//});

// display the home page
router.get('/', cc.home);

// display the list of items
router.get('/dashboard', cc.dashboardHome);
// feb--display the csv file ingest screen
router.get('/csv', csv.csvHome);
// feb--process the csv file and put the records in the database
router.post('/csv', csv.csvIngest);
// feb--display the photo ingest screen
router.get('/photos', photos.photosHome);
// feb--process the csv file and put the records in the database
router.post('/photos', photos.photosIngest);
// feb--process the csv file and put the records in the database

// show photo check page
router.get('/photoCheck', photos.photoCheck);

// show photo check page
router.post('/photoCheck', photos.photoCheckProcess);
// show general pagesrouter.get('/photoCheck', photos.photoCheck);
// show cardholders page
router.get('/cardholders', cardholders.cardholdersHome);
router.get('/badgeDetail/:badgeID', badges.badgesGetOne);
router.get('/badges', badges.badgesHome);
router.get('/badgesActive', badges.badgesActive);
router.get('/badgesInactive', badges.badgesInactive);


// Routes for EVENTS
// show events list
router.get('/events', events.eventsHome);
// show event Add form
router.get('/eventAdd', events.eventAdd);
// add event to database
router.post('/eventAdd', events.eventPostDatabase);
router.get('/eventModify/:eventID', events.eventGetOne);
router.get('/eventModify', events.eventGetOne);
router.post('/eventModify/:eventID', events.eventUpdateOne);
router.get('/eventAttendance/:eventID', events.eventAttendance);
router.get('/eventsUpcoming', events.eventsUpComing);
router.post('/eventAttendance/:eventID', events.writeAttendanceRpt);

router.get('/eventAddInviteList/:InvitationListID/:eventID', events.eventAddInviteList);
router.post('/eventChangeInviteList/:InvitationListID/:eventID', events.eventChangeInviteList);

router.get('/connections', connections.connectionsHome);
router.get('/devices', devices.devicesHome);
router.get('/deviceModify/:authCode', devices.deviceGetOne);
router.post('/deviceModify/:authCode', devices.deviceUpdateOne);
router.get('/deviceHistory/:authCode', devices.deviceGetHistory);

router.get('/settings', settings.settingsHome);
router.post('/settings', settings.settingsUpdate);
router.get('/settingsRestart', settings.settingsRestart);

router.get('/users', users.usersHome);
router.get('/userAdd', users.userAdd);

router.post('/userAdd', users.userAddToDb);
router.get('/userModify/:userName', users.userGetOne);
router.post('/userModify/:userName', users.userUpdateOne);
router.get('/userDelete/:userName', users.userGetOneForDelete);
router.post('/userDelete/:userName', users.userDeleteOne);


// Routes for VERIFY (records of scans through the verify app)
// show events list
router.get('/verifyRecords', verify.verifyHome);

// Drill down into the records for a particular badge 
router.get('/verifyCheck/:badgeID', verify.verifyGetOne);
// Display the search result for drill down 
router.post('/verifyCheck/:badgeID', verify.verifySearch);
router.post('/verifyReport/:badgeID', verify.writeCardscansRpt);
router.get('/contractorCheck/:contractor', verify.contractorGetOne);

// MUSTERING routes
router.get('/musterHome', mustering.musterHome);
router.get('/musterAdd', mustering.musterAdd);
router.post('/musterAdd', mustering.musterPostDatabase);

// Drill down into the records for a particular badge 
router.get('/musterDetail/:musterID', mustering.musterGetOne);
router.post('/musterDetail/:eventID', mustering.writeMusteringRpt);

router.get('/musterModify/:musterID', mustering.musterGetOneForEdit);
router.post('/musterModify/:musterID', mustering.musterUpdateOne);

// Display the search result for drill down 
//router.post('/musterDetail/:badgeID', mustering.verifySearch);
// Drill down into the records for a particular badge 
router.get('/musterLive/:musterID', mustering.musterLive);
router.get('/musterPoints', mustering.musterPointHome);
router.get('/musterPointModify/:pointID', mustering.musterPointGetForModify);
router.post('/musterPointModify/:pointID', mustering.musterPointUpdateOne);
//attn: delete processing for muster point
//router.get('/musterPointModify/:pointID', mustering.musterPointDelete);




//the muster zone add screen
router.get('/musterPointAdd', mustering.musterPointAdd);
//post the muster zone after is was added
router.post('/musterPointAdd', mustering.musterPointPostDatabase);
//gets the list of available devices that can be selected for the zone
router.get('/devicePointAdd/:pointID', mustering.deviceListForPoint);
router.get('/devicePointChange/:pointID/:authCode', mustering.deviceChangeForMusterPoint);

//Posts the selected device to the muster point record
router.get('/musterPointAddDevice/:AuthCode/:pointID', mustering.deviceAddForPoint)
router.post('/musterPointAddDevice/:AuthCode/:pointID', mustering.deviceAddForPoint)





router.get('/evacuationHome', evacuation.evacuationHome);
router.post('/evacuationHome', evacuation.evacuationCSV);


router.get('/inviteLists', invites.inviteLists);
router.get('/inviteLists/:eventID', invites.inviteListsforEvent);
router.get('/inviteListsAdd/:eventID', invites.inviteListsAddforEvent);
router.get('/inviteListsChange/:eventID/:eventName/:invitationListID', invites.inviteListsChangeforEvent);
router.get('/inviteAdd', invites.inviteAdd);
router.post('/inviteAdd', invites.inviteIngest);
router.get('/invitees/:invitationListID', invites.invitees);

router.get('/about', cc.about);
router.get('/unauthorized', cc.unauthorized);

// show photo check page
router.get('/setup', cc.about);
// handle the entry of username.  logging in
router.post('/', cc.home_post_handler);


// and logging out, closing the session
router.get('/logout', function (req, res) {
	    // delete the session variable
	sess = req.session;
	console.log("logging out " + sess.username);
	    delete sess.username;
	delete sess.success;
	delete sess.photoSuccess;
	delete sess.error;
	console.log("logged out " + sess.username);
	    // redirect user to homepage
	    res.redirect('/');
});




var GuardPatrols = require('../controllers/GuardPatrols');
router.get('/guardpatrols', GuardPatrols.getAllGuardPatrols);
//
var FoxMaps = require('../controllers/foxmaps');
router.get('/foxmaps', FoxMaps.getAllGuardPatrols);


//////////////////////////////////###### Fri Oct 6 22:42:24 PDT 2017 ARA
var Guards = require('../controllers/Guards');
router.get('/guards', Guards.getAllGuards);
router.get('/guards/:id', Guards.getGuardByID);
router.post('/guards', Guards.addGuard);
router.delete('/guards/:id', Guards.deleteGuard);
router.put('/guards/:id', Guards.updateGuard);

var Patrols = require('../controllers/Patrols');
router.get('/patrols', Patrols.getAllPatrols);
router.get('/patrols/:id', Patrols.getPatrolByID);
router.post('/patrols', Patrols.addPatrol);
router.delete('/patrols/:id', Patrols.deletePatrol);
router.put('/patrols', Patrols.updatePatrol);

var Incidents = require('../controllers/Incidents');
router.get('/incidents', Incidents.getAllIncidents);
router.get('/incidents/:id', Incidents.getIncidentByID);
router.post('/incidents', Incidents.addIncident);
router.delete('/incidents/:id', Incidents.deleteIncident);
router.put('/incidents/:id', Incidents.updateIncident);

var Checkpoints = require('../controllers/Checkpoints');
router.get('/checkpoints', Checkpoints.getAllCheckpoints);
router.get('/checkpoints/:id', Checkpoints.getCheckpointByID);
router.post('/checkpoints', Checkpoints.addCheckpoint);
router.delete('/checkpoints/:id', Checkpoints.deleteCheckpoint);
router.put('/checkpoints/:id', Checkpoints.updateCheckpoint);

var Coordinates = require('../controllers/Coordinates');
router.get('/coordinates', Coordinates.getAllCoordinates);
router.get('/coordinates/:id', Coordinates.getCoordinateByID);
router.post('/coordinates', Coordinates.addCoordinate);
router.delete('/coordinates/:id', Coordinates.deleteCoordinate);
router.put('/coordinates', Coordinates.updateCoordinate);

var Routes = require('../controllers/Routes');
router.get('/routes', Routes.getAllRoutes);
router.get('/routes/:id', Routes.getRouteByID);
router.post('/routes', Routes.addRoute);
router.delete('/routes/:id', Routes.deleteRoute);
router.put('/routes', Routes.updateRoute);
router.get('/currentroutes', Routes.getCurrentRoutes);

///

module.exports = router;