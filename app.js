var express = require('express'),
http = require('http'),
path = require('path'),
mongoose = require ('mongoose'),
request = require('request'),
parseString = require('xml2js').parseString,
memoize = require('memoizee'),
async = require('async');

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
  app.use(express.static(path.join(__dirname, 'public'), {maxAge: '100d'}));
});

app.configure('development', function(){
  app.use(express.errorHandler());
});

app.get('/', function (req, res){
	res.render('login');
});

app.get('/main', function (req, res){
  getSongs(function(results){
    res.render('main', {results: results, 'song': req.query.q});
  });
});

app.get('/groove', function(req, res){
  res.render('groove');
});

function getSongsFromYoutube(song, type, callback){
  request("https://gdata.youtube.com/feeds/api/videos?q=" + song + " " + type + "&max-results=4&format=5&v=2", function(err, response, body){
    if(err){ callback(null, err);}
    parseString(body, function (err, result) {
      var entries = result.feed.entry;
      var results = [];
      entries.forEach(function(entry){
        entryObj = {};
        entryObj.title = entry.title[0];
        entryObj.author =  entry.author[0].name[0];
        entryObj.image = entry['media:group'][0]['media:thumbnail'][0]['$']['url'];
        var idStr = entry.id[0];
        entryObj.id = idStr.substr(idStr.search('video:') + 6);
        results.push(entryObj);
      });
      callback(results);
    });
  });
}

function getSongsFromYoutubeWrapper(songname, callback){
  async.parallel({
    lyrics: function(callback){
      getSongsFromYoutube(songname, 'lyrics', function(result, err){
        if(err){callback(err, null);}
        callback(null, result);
      });
    },
    karaoke: function(callback){
      getSongsFromYoutube(songname, 'karaoke', function(result, err){
        if(err){callback(err, null);}
        callback(null, result);
      });
    },
    covers: function(callback){
      getSongsFromYoutube(songname, 'covers', function(result, err){
        if(err){callback(err, null);}
        callback(null, result);
      });
    }
  }, function(err, results){
    if(err) console.log(err);
    callback(results);
  });
}


memoized = memoize(getSongsFromYoutubeWrapper, {primitive: true, async: true,  maxAge: 10000000});

app.get('/songs/:name', function(req, res){
  var songname = req.params.name;
  memoized(songname, function(results){
    res.send(results);
  });
});


var s = http.createServer(app);
s.listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});