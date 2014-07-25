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
	res.render('login');
});
app.get('/main', function (req, res){
	res.render('main');
});

app.get('/groove', function(req, res){
  console.log(req.query.dj);
  res.render('groove', {dj: req.query.dj});
});

var s = http.createServer(app);
s.listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});

var io = require('socket.io')(s);

io.on('connection', function (socket) {
  socket.on('curbroad', function (data) {
    console.log(data)
     socket.broadcast.emit('data', { cur: data.cur });
  });
});