const
    passport = require("passport"),
    BearerStrategy = require("passport-http-bearer"),
    jwt = require("jsonwebtoken"),
    bcrypt = require("bcrypt"),
    User = require("../../db").User
;

module.exports = new BearerStrategy(function getBearer(token, done){
        try{
            var tokenDetails = jwt.decode(token);
        }catch(err){
            return done({token: "invalid jwt"})
        }
        if(!tokenDetails)
            return done({token: "invalid jwt"});
        User.findOne({username: tokenDetails.username}, function verifyJwt(err, user){
            if(err) return done(err);
            if(!user) return done({token: "unrecognized token"});
            jwt.verify(token, String(user._id), {maxAge: 3600}, function returnUser(err, tokenDetails){
                if(err){
                    return done({token: err.message})
                }
                return done(null, user)
            })
        })
    })
;

