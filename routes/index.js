
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


// RouteController for EVENTS
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

// RouteController for VERIFY (records of scans through the verify app)
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



//############################################### Convoyer ############################################################
var GuardController = require('../controllers/Convoyer/GuardController');

router.post('/guardauth', GuardController.authenticateGuard);

router.get('/guardlist', GuardController.guardList);

router.get('/guardAdd', GuardController.guardAdd);
router.post('/guardAdd', GuardController.guardAddToDb);
        
router.get('/guardModify/:GuardID', GuardController.getGuardByID);
router.post('/guardModify/:GuardID', GuardController.updateGuard);
router.get('/guardDelete/:GuardID', GuardController.getGuardForDelete);
router.post('/guardDelete/:GuardID', GuardController.deleteGuard);


router.get('/guards', GuardController.getAllGuards);
router.get('/guards/:id', GuardController.getGuardByID);
router.put('/guards', GuardController.updateGuardLogin);
router.put('/addDeviceToken', GuardController.addDeviceToken);
router.get('/getGuard/:username', GuardController.getGuardByUsername);

var RouteEditorController = require('../controllers/Convoyer/RouteEditorController');
router.get('/routeeditor', RouteEditorController.getRouteEditor);

var RouteEditorMapController = require('../controllers/Convoyer/RouteEditorMapController');
router.get('/routeeditormap', RouteEditorMapController.getRouteEditorMap);

var ConvoyerController = require('../controllers/Convoyer/ConvoyerController');
router.get('/convoyerliveview', ConvoyerController.getConvoyer);
router.get('/activeguards', ConvoyerController.getActiveGuards);
router.get('/guardnotifications', ConvoyerController.getGuardsForNotifications);

var ConvoyerMapController = require('../controllers/Convoyer/ConvoyerMapController');
router.get('/convoyerlivemap', ConvoyerMapController.getAllGuardPatrols);


var PatrolReplayController = require('../controllers/Convoyer/PatrolReplayController');
router.get('/patrolreplay/:id', PatrolReplayController.getPatrolReplay);

var PatrolReplayMapController = require('../controllers/Convoyer/PatrolReplayMapController');
router.get('/patrolreplaymap/:id', PatrolReplayMapController.getPatrolReplayMap);

var IncidentDetailController = require('../controllers/Convoyer/IncidentDetailController');
router.get('/incidentdetails/:id', IncidentDetailController.getIncidentDetails);
router.get('/incidentpreview/:id', IncidentDetailController.getIncidentPreview);

var IncidentDetailMapController = require('../controllers/Convoyer/IncidentDetailMapController');
router.get('/incidentdetailmap/:id', IncidentDetailMapController.getIncidentDetailMap);

var PatrolController = require('../controllers/Convoyer/PatrolController');
router.get('/patrols', PatrolController.getAllPatrols);
router.get('/patrols/:id', PatrolController.getPatrolByID);
router.post('/patrols', PatrolController.addPatrol);
router.delete('/patrols/:id', PatrolController.deletePatrol);
router.put('/patrols', PatrolController.updatePatrol);
router.get('/patrollist', PatrolController.patrolList);

var IncidentController = require('../controllers/Convoyer/IncidentController');
router.get('/incidents', IncidentController.getAllIncidents);
router.get('/incidents/:id', IncidentController.getIncidentByID);
router.post('/incidents', IncidentController.addIncident);
router.delete('/incidents/:id', IncidentController.deleteIncident);
router.put('/incidents/:id', IncidentController.updateIncident);
router.get('/incidentlist', IncidentController.incidentList);

var PatrolAreaController = require('../controllers/Convoyer/PatrolAreaController');
router.get('/patrolareas', PatrolAreaController.getAllPatrolAreas);
router.get('/patrolareas/:id', PatrolAreaController.getPatrolAreaByID);
router.post('/patrolareas', PatrolAreaController.addPatrolArea);
router.delete('/patrolareas/:id', PatrolAreaController.deletePatrolArea);
router.put('/patrolareas', PatrolAreaController.updatePatrolArea);

var CheckpointController = require('../controllers/Convoyer/CheckpointController');
router.get('/checkpoints', CheckpointController.getAllCheckpoints);
router.get('/checkpoints/:id', CheckpointController.getCheckpointByID);
router.post('/checkpoints', CheckpointController.addCheckpoint);
router.delete('/checkpoints/:id', CheckpointController.deleteCheckpoint);
router.put('/checkpoints/:id', CheckpointController.updateCheckpoint);

var CoordinateController = require('../controllers/Convoyer/CoordinateController');
router.get('/coordinates', CoordinateController.getAllCoordinates);
router.get('/coordinates/:id', CoordinateController.getCoordinateByID);
router.post('/coordinates', CoordinateController.addCoordinate);
router.delete('/coordinates/:id', CoordinateController.deleteCoordinate);
router.put('/coordinates', CoordinateController.updateCoordinate);

var RouteController = require('../controllers/Convoyer/RouteController');
router.get('/routes', RouteController.getAllRoutes);
router.get('/routes/:id', RouteController.getRouteByID);
router.post('/routes', RouteController.addRoute);
router.post('/saveroute', RouteController.saveRoute);
router.delete('/routes/:id', RouteController.deleteRoute);
router.put('/setcurrentroute', RouteController.updateRoute);
router.put('/disableroutes', RouteController.disableRoutes);
router.get('/currentroutes/:id', RouteController.getCurrentRoutes);
router.put('/queueroute', RouteController.queueRoute);

var MessageController = require('../controllers/Convoyer/MessageController');
router.get('/messages', MessageController.getAllMessages);
router.post('/messages', MessageController.addMessage);
//############################################### Convoyer END ############################################################


//############################################### Invite List ############################################################
var InviteListController = require('../controllers/InviteListController');
router.get('/createinvitelist', InviteListController.createInviteListHome);
router.get('/lastinvitelist', InviteListController.getLastInviteList);
router.post('/postinvitelist', InviteListController.postInviteList);
router.post('/postinvitee', InviteListController.postInvitee);
router.get('/listwizard', InviteListController.renderListWizard);
router.get('/listwizard', InviteListController.renderListWizard);
router.get('/listwizard/:groupCategory/:groupName', InviteListController.getPeopleByGroup);
router.delete('/distributionlist', InviteListController.truncateDistributionList);
router.post('/distributionlist', InviteListController.postDistributionList);
router.post('/distributionlistmembers', InviteListController.postDistributionListMembers);
router.get('/distributionlistmembers', InviteListController.getDistributionListMembers);
router.delete('/distributionlistmembers', InviteListController.truncateDistributionListMembers);
//############################################### Invite List END ############################################################


//############################################### Microsoft Graph ############################################################

var MicrosoftGraphController = require('../controllers/MicrosoftGraphController');

router.get('/microsoftgraph', MicrosoftGraphController.getPeople);
router.post('/microsoftgraph', MicrosoftGraphController.addPerson);

//############################################### Microsoft Graph END ############################################################


module.exports = router;