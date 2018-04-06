const
    router = require("express").Router()
;

router
    .get(express.static(path.join(__dirname, '../admin')))
    .get("/", function serveAdmin(req, res, next){
        return res.render("admin", {admin: req.user});
    })