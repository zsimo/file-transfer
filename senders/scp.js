"use strict";

var path = require("path");
var sendersCommon = require(path.resolve(process.cwd(), "senders", "common"));
var config = require(path.resolve(process.cwd(), "config"));
var fs = require("fs");
var scp2 = require('scp2').Client;


var start = Date.now();
var scpClient = new scp2({
    host: config.SCP_HOST,
    username: config.SCP_USER,
    password: config.SCP_PWD,
    path: config.SCP_RECEIVER_PATH
});

var file = sendersCommon.getInputFilePath();
var fileName = path.basename(file);
var fileLength = fs.statSync(file).size;

scpClient.upload(file, config.SCP_RECEIVER_PATH, function (err) {
    if (err) {
        console.log(err);
    } else {
        var elapsed = Date.now() - start;
        console.log(`uploaded in ${elapsed}ms`);
        console.log(`speed was: ${((fileLength / (1024 * 1024)) / (elapsed / 1000)).toFixed(2)} MB/s`);
    }
    scpClient.close();
})
scpClient.on("transfer", function (buffer, uploaded, total) {
    var percent = Math.round((uploaded / total) * 100) + "%";
    console.log(`sending ${fileName} ${percent}`);
});
scpClient.on("connect", function (buffer, uploaded, total) {
    console.log("connected");
});
scpClient.on("ready", function (buffer, uploaded, total) {
    console.log("transfer ready");
});
scpClient.on("end", function (buffer, uploaded, total) {
    console.log(`transfer end, ${fileName} (${(fileLength / (1024 * 1024)).toFixed(2)}mb)`);
});
scpClient.on("close", function (buffer, uploaded, total) {
    console.log("connection close");
});