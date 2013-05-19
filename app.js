
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , user = require('./routes/user')
  , http = require('http')
  , mysql = require('./mysql.js')
  , path = require('path');

var app = express();

app.configure(function(){
  app.set('port', 8000); //process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  //app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.cookieParser('your secret here'));
  app.use(express.session({ secret: 'mysecret',cookie: {maxAge: 3600 *1000}}));

  app.use(express.session());
  app.use(app.router);
  app.use(express.static(path.join(__dirname, 'public')));
});

//app.register('.html',require('jade'));
app.configure('development', function(){
  app.use(express.errorHandler());
});

app.get('/', routes.login);
//app.get('/preview', routes.preview);
app.get('/login', routes.login);
app.get('/range', routes.rangeTest);
app.get('/main', routes.main);
app.get('/logout', routes.logout);
app.post('/verify', user.verifyLogin);
app.post('/addUser', user.addUser);
app.post('/addSong', user.addSongs);
app.post('/setUserRange', user.setUserRange);
//app.post('/pitches', user.addPitches);
app.post('/getSongs', user.getSongs);

http.createServer(app).listen(app.get('port'), function(){
    //app.use(express.basicAuth(authorize));
  console.log("Express server listening on port " + app.get('port'));
});
