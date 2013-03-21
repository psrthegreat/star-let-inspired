/*
 * GET users listing.
 */


var fs = require('fs');
exports.list = function(req, res){
  res.send("respond with a resource");
};

//useless echo
exports.echo = function(req, res){
    res.send("Hello, " + req.query.user);
    console.log(req.query.user);
    console.log(req.query.pswd);
    console.log(req.query);
    res.send("Your password is: " + req.query.pswd);
};


//getSongs is the main call to getting closest songs
//needs work on the range implementation
exports.getSongs = function(req,res){
    var database = require('../mysql.js');
    database.DBConnect();
    function sendResults(err,results,field){
        var validator = require('../validator.js');
        console.log(results);
        res.json(results);
        res.end();
        database.DBClose();
    }
    database.DBGetClosestSongs(req,sendResults);
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

// add validators here
//addUser inserts their email and a hashed password. posted to by signup page
exports.addUser = function(req,res){
    var database = require('../mysql.js');
    database.DBConnect();
    database.DBNewUser(req, res);
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


//what is this doing here?
exports.verifyLogin = function(req,res){
    var database = require('../mysql.js');
    var username = req.body.username;
    var password = req.body.password;
    var hashedpw = password;
    //var hashedpw = hash(password);
    function authorize(err, results, field){
        console.log(results);
        if (results.length > 0){
            console.log('user found = ' + results[0].username);
            if (results[0].hashpass === hashedpw){
                console.log("passwords match");
                req.session.username = username;
                res.redirect('/');
                res.end("passwords match")
            } else {
                console.log("passwords don't match");
                res.end("passwords don'tmatch")
                //res.redirect(login); incorrect username or password
            }
        }
        //res.redirect(login); incorrect username or password
    }
    //if (req.body.user == "paul"){ res.send("False"); } else if (req.body.user == "vincent" && req.body.pswd == "pranav") { res.send("Success"); } else { res.send("Try again."); }
    database.DBConnect();
    database.DBLookUpUser(username, authorize);
    database.DBClose();
};

//login is used in response to get call
exports.login = function(req,res){
    fs.readFile('./views/login.html', function (err, html){
        if (err) throw err;
        res.writeHead(200, {"Content-type": "text/html"});
        res.write(html);
        res.end();
    });
}

