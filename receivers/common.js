"use strict";

var path = require("path");
var fs = require("fs");

module.exports = {

    createOutputDir: function () {
        var filesDir =  path.resolve(process.cwd(), "receivers", "files");
        fs.mkdirSync(filesDir, {recursive: true});
        return filesDir;
    }
};