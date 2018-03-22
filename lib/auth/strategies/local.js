const
    passport = require("passport"),
    User = require("../../db").User,
    LocalStrategy = require("passport-local"),
    bcrypt = require("bcrypt")
;

module.exports = new LocalStrategy(function getUser(username, password, done){
    let credentials= {username, password},
        errorDetails = {}
    ;
    for(credential in credentials){
        if(!credentials[credential]){
            errorDetails[credential] = `${credential} not provided`;
        }
    }
    if(Object.keys(errorDetails).length > 0) return done(null, false, {message: errorDetails});
    User.findOne({username}, function verifyCredentials(err, user){
        if(err) return done(err);
        if(!user) return done(null, false, {message: {username: "user not found"}});
        bcrypt.compare(String(password), user.password, function verifyPassword(err, bool){
            if(err) return done(err);
            if(!bool) return done(null, false, {message: {password: "incorrect Password"}});
            return done(null, user)
        })
    })
})