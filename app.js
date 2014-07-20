var express = require('express'),
	http = require('http'),
	path = require('path');

var app = express();

app.configure(function(){
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.cookieParser('your secret here'));
  app.use(express.session({ secret: 'mysecret',cookie: {maxAge: 3600 *1000}}));
  app.use(express.session());
  app.use(app.router);
  app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function(){
  app.use(express.errorHandler());
});

app.get('/', function (req, res){
	res.sendfile("./public/login.html");
});
app.get('/range', function (req, res){
	res.sendfile("./public/rangefinder.html");
});
app.get('/main', function (req, res){
	res.sendfile('./public/main.html');
});

http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});
