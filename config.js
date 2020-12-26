"use strict";

var envToConfig = require("env-to-config");
var config = envToConfig({
    mandatory_keys: [
        "RECEIVER_URL"
    ]
});

module.exports = config;