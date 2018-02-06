var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mysql = require('mysql');
var beckenbauer = require('./controllers/beckenbauer');
//feb--.lc script processing
var SimpleCGI = require('simplecgi');
const opn = require('opn');

//require('./models/db');

//* SSL CHANGES - NEXT 3 LINES
var https = require("https")
var http = require("http")
var fs = require('fs');
require('dotenv').config();

// var cc = require('./routes/cc');

// attempt to use express 4 sessions, as express 3 method now deprecated
var session = require('express-session');

/**
 * SSL certificate set up, if SSL is ON and conditioned on
 * whether cert was generated with a passphrase or not
 */
//var privateKey = fs.readFileSync( 'mobsscloudcert.pem' ).toString();
//var certificate = fs.readFileSync( 'STAR_mobsscloud_com.crt' ).toString();
if (process.env.CC_SSL == "YES") {
  var privateKey = fs.readFileSync(process.env.CERT_NAME + '.key').toString();
  var certificate = fs.readFileSync(process.env.CERT_NAME + '.crt').toString();
  if (process.env.CERT_PASSPHRASE == "") {
    var options = { key: privateKey, cert: certificate };
  } else {
    var passphrase = process.env.CERT_PASSPHRASE
    var options = { key: privateKey, cert: certificate, passphrase: passphrase };
  }
}

var app = express();


// which index file to use
var routes = require('./routes/index');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');


// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));

// following two lines work for looging in but no post data is read
app.use(bodyParser.json());
//app.use(bodyParser.urlencoded({ extended: false }));

//following lines 
//app.use(bodyParser.json({limit: '50mb'}));
//app.use(bodyParser.json({limit:1024*1024*20, type:'application/json'}));
//--> works for login not for verifyercords app.use(bodyParser.urlencoded({limit: '50mb', extended: false, parameterLimit:50000}));
//-APR 20-> x-www and multiform both work for posting (as long as using irldecode in script).  BUT log-in does not
app.use(bodyParser.urlencoded({ extended: true, limit: 1024 * 1024 * 20, type: 'application/x-www-form-urlencoding' }));
//app.use(bodyParser.json({limit:1024*1024*20, type:'application/json'}));
//--> works for verify records not for log-in  app.use(bodyParser.urlencoded({ extended:true,limit:1024*1024*20,type:'application/x-www-form-urlencoding'}));

app.use(cookieParser());
app.use(require('stylus').middleware(__dirname + '/public'));
// feb-- .lc processing.  this line has to go BEFORE the app.use(express.static) line, or it doesnt run the engine.
// feb-- tried to do this through the router but couldnt get it to work
app.all(/^.+[.]lc$/, SimpleCGI(
  __dirname + '/livecode-server/livecode-server.exe', __dirname + '/public', /^.+[.]lc$/
));
app.use(express.static(path.join(__dirname, 'public')));

//feb-- the new express 4 sessions stuff, as express 3 method now deprecated
app.use(session({
  secret: 'boris',
  saveUninitialized: true,
  resave: true
}));


app.use(bodyParser.urlencoded({ limit: '50mb', extended: false, parameterLimit: 50000 }));




///////////////////////////////// ###### Thu Dec 28 10:16:09 PST 2017 ARA

app.use('/', routes);

// var option = {
//   setHeaders: function (res, path, stat) {
//     res.set('Authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJmb28iOiJiYXIiLCJpYXQiOjE1MTQ0OTEzOTN9.CwxysSiYQLIF8JdQ6_f0MmkuoJ-3GuQYrBLquAhmvDU')
//   }
// }

// var jwt = require('jsonwebtoken');
// var token = jwt.sign({ foo: 'bar' }, 'secret');
// console.log('logging token');
// console.log(token);

// var expressJwt = require('express-jwt');
// app.use('/', expressJwt({
//   secret: 'secret',
//   getToken: function fromHeaderOrQuerystring (req) {
//       if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
//           return req.headers.authorization.split(' ')[1   ];
//       } else if (req.query && req.query.token) {
//           return req.query.token;
//       }
//       return null;
//   }
// }).unless({path: ['/']}),
// routes );

//////////////////////////////////////////////////////////////////////////


//app.use('/users', users);


// catch 404 and forward to error handler
app.use(function (req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

///////////////////////////////////////
// daily csv sweeper                 //
///////////////////////////////////////
var CronJob = require('cron').CronJob;

if (process.env.SWEEP_SCHED != "OFF") {

  /*
  Each of the 6 ranges represent, left to right...
  Seconds: 0-59
  Minutes: 0-59
  Hours: 0-23
  Day of Month: 1-31
  Months: 0-11
  Day of Week: 0-6
  eg: runs 5 days a week at 640PM
  '00 40 18 * * 1-5'
  Six * means runs every second
   */
  //new CronJob('00 46 12 * * 1-5', function() {

  //###### Tue Oct 3 07:12:37 PDT 2017  Seperate the photos and data elements of the sweep
  var sweepDataAndPhotos = process.env.SWEEP_SCOPE

  new CronJob('0 36 00 * * 0-6', function () {

    //new CronJob('* * * * * *', function() {
    //###### Tue Oct 3 07:12:37 PDT 2017  Seperate the photos and data elements of the sweep
    beckenbauer.sweeper(sweepDataAndPhotos, function (err, rslt) {
      if (err) { console.log('cron unsuccessful: ' + err); }
    });

  }, null, true, 'America/New_York');
}


// console.log('You will see this message every second');
//this will allow us to simply add a hardcoded directory daily csv and then it will simply read the latest file in the directory and determine if there has been a change
//console.log('the path is '+__dirname); // this looks like the application directory
//console.log('the path is '+__filename); // this is the directory plus app.js
//console.log('the path is '+process.argv[1]);//this is the directory plus app

var port = process.env.PORT || 3000;
/**
 * Adding a name for the listen object so we can then set the timeout length.
 * Node defaults to 2 minutes, which is too sort to wait for long inserts.
 * Have only done the for HTTP so far.
 */
var server = app.listen(port, function () {
  console.log("Listening on " + port);

});

server.setTimeout(10 * 60 * 1000); // 10 * 60 seconds * 1000 msecs = 10 minutes


// You can set morgan to log differently depending on your environment
//console.log(__dirname);
//app.use(logger('common', { skip: function(req, res) { return res.statusCode < 400 }, stream: __dirname + '/morgan.log' }));

/** 
 * If SSL enabled, create a server instance for SSL
 * 
 */
if (process.env.CC_SSL == "YES") {
  https.createServer(options, app).listen(443, function () {
    console.log('App listening on port 443!')
  });
}



// Opens the url in the default browser
//if (process.env.SETUP_STS == 1){
//console.log('getting here '+process.env.SETUP_STS)
//opn('http://localhost:3000');
//} else{
//opn('http://localhost:3000/setup');
//}


/*
=====================================================================
=====================================================================
              ###### Wed Oct 4 18:39:53 PDT 2017 ARA
=====================================================================
=====================================================================
**/


var app = express();
var io = require('socket.io')(server);


// Chatroom

var numUsers = 0;

io.on('connection', function (socket) {

  initializeSockets(socket);

});


function initializeSockets(socket){
  /*
  =====================================================================
  =====================================================================
                          NOTIFICATION STUFF
  =====================================================================
  =====================================================================
  **/


  let tokens = getDevices();

  const apn = require("apn");

  const notificationOptions = {
    token: {
      key: "C:/Users/Administrator/greyfox/certificates/AuthKey_U6BYE7K8Q5.p8",
      keyId: "U6BYE7K8Q5",
      teamId: "KUJ3K83XLJ"
    },
    production: false
  };

  var apnProvider = new apn.Provider(notificationOptions);
  // let deviceToken = "94b9c26276c600d067a09803bfae74611b7e1b91872e72567df15d5040ad681b" 

  var note = new apn.Notification();

  note.expiry = Math.floor(Date.now() / 1000) + 3600; // Expires 1 hour from now.
  note.sound = "ping.aiff";
  note.badge = 0;
  note.alert = "\uD83D\uDCE7 \u2709 You have a new message";
  note.payload = { 'messageFrom': 'GREYFOX' };
  note.topic = "mobss.foxwatch";

  /*
  =====================================================================
  =====================================================================
                            SOCKET.IO STUFF
  =====================================================================
  =====================================================================
  **/


  var addedUser = false;

  // when the client emits 'message', this listens and executes
  socket.on('message', function (data) {
    // we tell the client to execute 'new message'

    if (socket.username == null) {
      socket.username = "FOX"
    }
    socket.broadcast.emit('message', {
      username: socket.username,
      message: data
    });

    apnProvider.send(note, tokens).then((result) => {
      var res = JSON.stringify(result);
      console.log("logging result");
      console.log(res);
    });
  });

  /// when the client emits 'add user', this listens and executes
  socket.on('add user', function (username) {
    if (addedUser) return;

    tokens = getDevices();

    // we store the username in the socket session for this client
    socket.username = username;
    ++numUsers;
    addedUser = true;
    socket.emit('login', {
      numUsers: numUsers
    });
    // echo globally (all clients) that a person has connected
    socket.broadcast.emit('user joined', {
      username: socket.username,
      numUsers: numUsers
    });
  });

  // when the client emits 'typing', we broadcast it to others
  socket.on('typing', function () {
    socket.broadcast.emit('typing', {
      username: socket.username
    });
  });

  // when the client emits 'stop typing', we broadcast it to others
  socket.on('stop typing', function () {
    socket.broadcast.emit('stop typing', {
      username: socket.username
    });
  });

  // when the End Patrol buttons is pressed.. do this
  socket.on('stop', function (){
    socket.broadcast.emit('patrol stop', {
      id: socket.id
    });
  })

  // when the user disconnects.. perform this
  socket.on('disconnect', function () {

    if (addedUser) {
      --numUsers;

      // echo globally that this client has left
      socket.broadcast.emit('user left', {
        username: socket.username,
        numUsers: numUsers
      });
    }

  });

// when someone else disconnects, do this
  socket.on('user left', function () {
    tokens = getDevices();
  })

}

function getDevices(){
  let tokens = [];

  http.get('http://ec2-34-210-155-178.us-west-2.compute.amazonaws.com:3000/activeguards', (res) => {
    const { statusCode } = res;
    const contentType = res.headers['content-type'];

    let error;
    if (statusCode !== 200) {
      error = new Error('Request Failed.\n' +
        `Status Code: ${statusCode}`);
    } else if (!/^application\/json/.test(contentType)) {
      error = new Error('Invalid content-type.\n' +
        `Expected application/json but received ${contentType}`);
    }
    if (error) {
      console.error(error.message);
      // consume response data to free up memory
      res.resume();
      return;
    }

    res.setEncoding('utf8');
    let rawData = '';
    res.on('data', (chunk) => { rawData += chunk; });
    res.on('end', () => {
      try {
        const parsedData = JSON.parse(rawData);
        console.log(parsedData);

        for (var i = 0; i < parsedData.length; i++) {
          // console.log('logging a guard device token ');
          // console.log(parsedData[i].DeviceToken);

          tokens.push(parsedData[i].DeviceToken);
        }
      } catch (e) {
        console.error(e.message);
      }
    });
  }).on('error', (e) => {
    console.error(`Got error: ${e.message}`);
  });

return tokens;
}




module.exports = app;
