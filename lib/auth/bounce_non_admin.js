const
    passport = require("passport"),
    basicAuth = require("express-basic-auth"),
    {User} = require("../db")
;

module.exports = basicAuth({
    authorizer: checkIfAdmin,
    authorizeAsync: true,
    challenge: true,
    realm: "admin"
})

function checkIfAdmin(username, password, cb){
    User.findOne({username,password}, function afterFind(err, user){
        if(err) return cb(err);
        if(!user) return cb(null, false);
        return cb(null, true)
    })
}
