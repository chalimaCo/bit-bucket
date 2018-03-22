const
    strategies = require("./auth/strategies"),
    bounceUnauthorized = require("./auth/bounce_unauthorized")
;

module.exports = {
    strategies,
    bounceUnauthorized
    }