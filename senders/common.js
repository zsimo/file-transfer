"use strict";

var path = require("path");

module.exports = {
    getInputFilePath: function () {
        return path.resolve(process.cwd(), "senders", "files", "video01.mp4");
    }
};