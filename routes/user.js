/*
 * GET users listing.
 */

var SaltLength = 9;

var fs = require('fs');

function swap(results, i1, i2){
    var temp = results[i1];
    results[i1] = results[i2];
    results[i2] = temp;
}
//getSongs is the main call to getting closest songs
//needs work on the range implementation
exports.getSongs = function(req,res){
    var database = require('../mysql.js');
    var type = req.session.type;
    database.DBConnect();
    function sendResults(err,results,field){
        var validator = require('../validator.js');
        req.session.type = type;
        if (results){
            var songs = [];
            console.log(results.length);
            for (var i = 0; i < 15; i++){
                var index =Math.floor(Math.random()*results.length-i);
                console.log("index is "+ index);
                swap(results, i, index + i);
                songs[i] = results[i];
                //console.log("random song was " + results[index]);
                songs[i].song = validator.decode(songs[i].song);
                songs[i].artist = validator.decode(songs[i].artist);
            }
            //console.log(results);
            //res.end(JSON.stringify(songs));
            res.end(JSON.stringify(songs));
        } else {
            res.end();
        }
        database.DBClose();
    }
    database.DBGetClosestSongs(type,sendResults);
}

//addPitches will take information about songs. may be useless after having addsongs;
exports.addPitches = function(req,res){
    var database = require('../mysql.js');
    database.DBConnect();
    database.DBAddPitch(req);
    database.DBClose();
    res.end("I think it added it to database");
};

/*add songs */
exports.addSongs = function(req,res){
    var database = require('../mysql.js');
    database.DBConnect();
    console.log(req);
    console.log(req.body.song);
    database.DBAddSong(req);
    database.DBClose();
    res.end();
}


//signup is used in response to get call
exports.signup = function(req,res){
    fs.readFile('./views/signup.html', function (err, html){
        if (err) throw err;
        res.writeHead(200, {"Content-type": "text/html"});
        res.write(html);
        res.end();
    });
}

function md5(string){
    var crypto = require('crypto');
    return crypto.createHash('md5').update(string).digest('hex');
}
function generateSalt(len) {
  var set = '0123456789abcdefghijklmnopqurstuvwxyzABCDEFGHIJKLMNOPQURSTUVWXYZ',
      setLen = set.length,
      salt = ''; 
  for (var i = 0; i < len; i++) {
    var p = Math.floor(Math.random() * setLen);
    salt += set[p];
  }
  return salt;
}
function convertNoteToNumber(note){
    var octave = parseInt(note.charAt(1));
    var pitch = note.charCodeAt(0) - 65;
    return octave * 10 + pitch;
}
exports.setUserRange = function(req,res){
    var database = require('../mysql.js');
    var type;
    var gender = req.body.gender,
        high = req.body.high,
        low = req.body.low;
    low = convertNoteToNumber(low);
    high = convertNoteToNumber(high);
    if (gender == "Male"){
        if (high >= convertNoteToNumber("E5")){
            type = 1;
        } else {
            type = 0;
        }
    } else if (gender == "Female"){
        if (high >= convertNoteToNumber("C6")){
            type = 4;
        } else if (low <= convertNoteToNumber("F3")){
            type = 2;
        } else {
            type = 3;
        }
    }
    database.DBConnect();
    database.DBSetType(req.session.username,type);
    database.DBClose();
    req.session.type = type;
    res.redirect('/preview.html');
    console.log('type was ' + type);
}

//addUser inserts their email and a hashed password. posted to by signup page
exports.addUser = function(req,res){
    var database = require('../mysql.js');
    var password = req.body.password;
    var salt = generateSalt(SaltLength);
    var hashpass = salt + md5(password + salt);

    database.DBConnect();
    database.DBNewUser(req, res, hashpass);
    database.DBClose();
    req.session.username = req.body.email;
    res.redirect('/range'); 
}
exports.verifyLogin = function(req,res){
    var database = require('../mysql.js');
    var username = req.body.email;
    var password = req.body.password;
    //var hashedpw = hash(password);
    console.log(username);
    console.log(password);
    function authorize(err, results, field){
        console.log(results);
        if (results.length > 0){
            console.log('user found = ' + results[0].username);
            var hashed = results[0].hashpass;
            var salt = hashed.substr(0,SaltLength);
            var hashedpw = salt + md5(password + salt);

            if (hashed === hashedpw){
                console.log("passwords match");
                req.session.username = username;
                console.log("type from results: " + results[0].type);
                req.session.type = results[0].type;
                req.session.cookie.expires = false;
                if (results[0].type == null){
                    res.redirect('/range'); 
                } else {
                res.redirect('/main');
                }
                //res.end("passwords match")
            } else {
                console.log("passwords don't match");
                //res.end("passwords don't match")
                res.redirect('/login'); //incorrect username or password
            }
        } else {
            res.redirect('/login'); //incorrect username or password
        }
    }
    database.DBConnect();
    database.DBLookUpUser(username, authorize);
    database.DBClose();
};

