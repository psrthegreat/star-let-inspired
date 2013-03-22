var client;
function DBConnect(){
    var mysql = require('mysql');
    client = mysql.createConnection({
        host: 'localhost',
        port: 3306,
        user: 'vincent',
        password: 'vpspsr',
        database: 'test'
    }).on('success',function(){ console.log("connected to db");});
}

function printEntries(results){
    for (var i = 0; i < results.length; i++){
        console.log("Name: " + results[i].name + ", Age: " + results[i].age);
    }
}

function allDBEntries (callback, response){
    client.query( 'SELECT * from songs',
        function (err, results, fields){
            if (results.length > 0) callback(results, response);
    });
}

//SELECT EXISTS(SELECT 1 FROM mysql.user WHERE user = 'username')

function DBQuery(query, callback){ client.query(query,callback);};
function DBClose(){client.end();};

function DBAddPitch(req){
    var User = req.body.user;
    console.log("User is " + User);
    var Song = req.body.song;
    console.log("Song is " + Song);
    client.query("INSERT INTO pitches (user, song) values (\"" + User + "\",\""+ Song + "\")");
}

function DBAddSong(req){
    var validator = require('./validator.js');
    var song = validator.encode(req.body.song);
    var artist_type = req.body.type;
    var artist = validator.encode(req.body.artist);
    client.query('INSERT INTO songs (song, artist, artist_type) values (\'' + song + '\',\'' + artist + '\',' + artist_type+')');
    //check if id already in. sort by median
}
function DBNewUser(req, res, hashedpass){
    var validator = require('./validator.js');
    var user = validator.encode(req.body.email);
    //TODO: add a check if they're in the database;
    client.query('INSERT INTO users (username, hashpass) values (\'' + user +'\',\'' + hashedpass + '\')');
    //}
}
function DBGetClosestSongs(type, success){

    console.log("type is " + type);
    client.query('SELECT * FROM songs WHERE artist_type = ' + type + ' LIMIT 150',success);

};

function DBLookUpUser(username, success){
    client.query('SELECT * from users WHERE username = \'' + username + '\'', success);
}

function DBSetType(username, type){
    client.query('UPDATE users SET type = ' + type + ' where username = \'' + username + '\'');
}

module.exports.DBNewUser = DBNewUser;
module.exports.DBGetClosestSongs = DBGetClosestSongs;
module.exports.allDBEntries = allDBEntries;
module.exports.DBClose = DBClose;
module.exports.DBConnect = DBConnect;
module.exports.DBQuery = DBQuery;
module.exports.DBAddPitch = DBAddPitch;
module.exports.DBAddSong = DBAddSong;
module.exports.DBLookUpUser = DBLookUpUser;
module.exports.DBSetType = DBSetType;
