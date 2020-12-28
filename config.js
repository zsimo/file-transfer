"use strict";

var envToConfig = require("env-to-config");
var config = envToConfig({
    mandatory_keys: [
        "HTTP_RECEIVER_URL",
        "TCP_RECEIVER_HOST",
        "TCP_RECEIVER_PORT"
    ]
});

module.exports = config;