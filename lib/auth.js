const
    strategies = require("./auth/strategies"),
    bounceUnauthorized = require("./auth/bounce_unauthorized"),
    bounceNonAdmin = require("./auth/bounce_non_admin")
;

module.exports = {
    bounceNonAdmin,
    strategies,
    bounceUnauthorized
    }