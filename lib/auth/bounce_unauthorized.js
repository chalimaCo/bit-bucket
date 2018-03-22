const
    passport = require("passport"),
    appUtils = require("../utils")
;

module.exports = function bounceUnauthorized(req, res, next){
    if(!(req.headers.authorization) || !(req.headers.authorization.substring(0,6) === "Bearer")) return res.header("WWW-Authenticate", "Bearer")._sendError("authentication failed", appUtils.ErrorReport(401, {token: "jwt not provided"}));
    passport.authenticate("jwt", {session: false}, function(err, user, info){
        if(err){
            if(err.token) return res.header("WWW-Authenticate", "Bearer")._sendError("authentication failed", appUtils.ErrorReport(401, err));
            return next(appUtils.ServerError(err));
        }
        if(!user) return res.header("WWW-Authenticate", "Bearer")._sendError("authentication failed", appUtils.ErrorReport(401, info));
        next()
    })(req, res, next)
};