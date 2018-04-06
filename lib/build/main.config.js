const path = require("path");
module.exports = {
    entry: path.resolve("./scripts/main.js"),
    output: {
        filename: "main.js",
        path: path.resolve("../../public/scripts")
    }
}