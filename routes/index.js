
/*
 * GET home page.
 */
var fs = require('fs');


exports.index = function(req, res){
    if (!req.session.username){
        res.redirect('/login');
    } else {
        fs.readFile('./views/index.html',
        function(err, html) {
            if (err) throw err;
            res.writeHead(200, {"Content-type": "text/html"});
            res.write(html);
            res.end();
        });
    }
}
//function(req, res){ res.write('index', { title: 'Express' }); };
exports.comingSoon = function(req,res){
    fs.readFile('./views/coming-soon.html',
        function(err, html){
            if (err) throw err;
            res.writeHead(200, {"Content-type": "text/html"});
            res.write(html);
            res.end();
        });
}
exports.rangeTest = function(req,res){
    if (!req.session.username){
        res.redirect('/login');
    } else {
        fs.readFile('./views/range.html',
            function(err, html){
            if (err) throw err;
            res.writeHead(200, {"Content-type": "text/html"});
            res.write(html);
            res.end();
        });
    }
}
exports.login = function(req,res){
    if (req.session.username){
        res.redirect('/main');
    } else {
        fs.readFile('./views/login.html', function (err, html){
            if (err) throw err;
            res.writeHead(200, {"Content-type": "text/html"});
            res.write(html);
            res.end();
        });
    }
}
exports.logout = function(req,res){
    console.log("clearing...?");
    req.session.username = null;
    req.session.type = null;
    res.redirect('/');
}
exports.main = function(req,res){
    console.log("accessing main with type = " +req.session.type);
    fs.readFile('./views/index.html',
    function(err, html){
        if (err) throw err;
        res.writeHead(200, {"Content-type": "text/html"});
        res.write(html);
        res.end();
    });
}

