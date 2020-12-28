"use strict";

var path = require("path");

module.exports = {
    getInputFilePath: function () {
        return path.resolve(process.cwd(), "senders", "files", "video02.mp4");
    }
};