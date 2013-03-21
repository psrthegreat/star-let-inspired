var val = require('validator');
module.exports.encode = function(name){
    return val.sanitize(name).entityEncode();
}
module.exports.decode = function(name){
    return val.sanitize(name).entityDecode();
}
