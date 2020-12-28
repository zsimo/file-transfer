"use strict";

var path = require("path");
var fs = require("fs");
var net = require('net');
var config = require(path.resolve(process.cwd(), "config"));
var common = require(path.resolve(process.cwd(), "receivers", "common"));
var filesDir = common.createOutputDir();;
var fileName = "file.mp4";
fs.mkdirSync(filesDir, {recursive: true});

var writer = fs.createWriteStream(path.resolve(filesDir, fileName));

var server = net.createServer(function(socket) {

    var downloaded = 0;
    var start = Date.now();
    socket.on("data", function (chunk) {
        downloaded += chunk.length;
        console.log(`receiving ${(downloaded / (1024 * 1024)).toFixed(2)}MB`);
    });
    writer.on("finish", function () {
        console.log("finish");
        console.log(`receiving ${fileName} terminated in ${Date.now() - start}ms`);
    });
    socket.pipe(writer);
});
server.on("connection", function (socket) {
    console.log("client connected");
});

server.listen(config.TCP_RECEIVER_PORT, '0.0.0.0', function () {
    console.log("server listening on:", server.address());
});