"use strict";

var path = require("path");
var fs = require("fs");
var net = require('net');
var common = require(path.resolve(process.cwd(), "senders", "common"));
var config = require(path.resolve(process.cwd(), "config"));

var start = Date.now();
var file = common.getInputFilePath();
var fileLength = fs.statSync(file).size;
var fileName =  path.basename(file);
var reader = fs.createReadStream(file);


var client = new net.Socket();
client.connect(config.TCP_RECEIVER_PORT, config.TCP_RECEIVER_HOST, function() {
    console.log(`Connected to ${config.TCP_RECEIVER_HOST}:${config.TCP_RECEIVER_PORT}`);
});
client.on('close', function() {
    console.log('Connection closed');
    process.exit();
});

reader.pipe(client);

var upload_progress = 0;
reader.on("data", function (chunk) {
    upload_progress += chunk.length
    var percent = Math.round((upload_progress / fileLength) * 100) + "%";
    console.log(`sending ${fileName} ${percent}`);
});

reader.on("end", function (res) {
    var elapsed = Date.now() - start;
    console.log(`sending ${fileName} terminated in ${Date.now() - start}ms`);
    console.log(`speed was: ${((fileLength / (1024 * 1024)) / (elapsed / 1000)).toFixed(2)} MB/s`);
});