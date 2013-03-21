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
    client.query( 'SELECT * from example',
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
    var priority = req.body.priority;
    client.query('INSERT INTO songs (song, priority) values (\'' + song + '\',' + priority + ')');
}
function DBNewUser(req, res){
    var validator = require('./validator.js');
    //console.log(check(req.body.user).len(6, 64).isEmail());
    //if (check(req.body.user).len(6, 64).isEmail()){
        var user = validator.encode(req.body.username);
        var password = req.body.password;
        console.log(user + password);
        //TODO: add a check if they're in the database;
        client.query('INSERT INTO users (username, hashpass) values (\'' + user +'\',\'' + password + '\')');
    //}
}
function DBGetClosestSongs(req, success){
    var validator = require('./validator.js');
    var target = req.body.median;
    var range = req.body.stddev;
    //client.query('SELECT song FROM songs WHERE median = ' + target + ' AND range <= ' + range + '  LIMIT 10',success);
    client.query('SELECT song FROM songs WHERE priority = ' + target + ' LIMIT 10',success);
};

function DBLookUpUser(username, success){
    client.query('SELECT * from users WHERE username = \'' + username + '\'', success);
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
