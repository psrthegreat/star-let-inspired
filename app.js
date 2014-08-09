var express = require('express'),
	http = require('http'),
	path = require('path'),
  mongoose = require ('mongoose'),
  request = require('request'),
  parseString = require('xml2js').parseString,
  memoize = require('memoizee');

var uristring =
process.env.MONGOLAB_URI ||
process.env.MONGOHQ_URL ||
'mongodb://localhost/vocalet';

var getSongs = function(callback){
  request("https://itunes.apple.com/us/rss/topsongs/limit=15/xml", function(err, response, body){
    parseString(body, function (err, result) {
      var entries = result.feed.entry;
      var titles = []
      for(var i =0; i < entries.length; i++){
        titles.push(entries[i].title[0]);
      }
      callback(titles);
    });
  });
}

memoized = memoize(getSongs, {primitive: true, async: true,  maxAge: 10000000});

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

app.get('/try', function(req, res){
  memoized(function(response){
    res.send(response);
  });
});

app.get('/', function (req, res){
	res.render('login');
});
app.get('/main', function (req, res){
  getSongs(function(results){
    res.render('main', {results: results});
  });
});

app.get('/groove', function(req, res){
  console.log(req.query.dj);
  res.render('groove', {dj: req.query.dj});
});

app.get('/songs', function(req, res){
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

mongoose.connect(uristring, function (err, res) {
  if (err) {
  console.log ('ERROR connecting to: ' + uristring + '. ' + err);
  } else {
  console.log ('Succeeded connected to: ' + uristring);
  }
});
