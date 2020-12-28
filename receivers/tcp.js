"use strict";

var path = require("path");
var fs = require("fs");
var net = require('net');
var config = require(path.resolve(process.cwd(), "config"));
var common = require(path.resolve(process.cwd(), "senders", "common"));
var filesDir = common.createOutputDir();;
var fileName = "file.mp4";
fs.mkdirSync(filesDir, {recursive: true});

var writer = fs.createWriteStream(path.resolve(filesDir, fileName));

var server = net.createServer(function(socket) {
    //socket.write('Echo server\r\n');

    var downloaded = 0;
    var start = Date.now();
    socket.on("data", function (chunk) {
        downloaded += chunk.length;
        //var percent = Math.round((downloaded / totalLength) * 100) + "%";
        console.log(`receiving ${(downloaded / (1024 * 1024)).toFixed(2)}MB`);
    });
    writer.on("finish", function () {
        console.log("finish");
        console.log(`receiving ${fileName} terminated in ${Date.now() - start}ms`);

    });
    socket.pipe(writer);
});


console.log("server listening on:", config.TCP_RECEIVER_PORT, '0.0.0.0');
server.listen(config.TCP_RECEIVER_PORT, '0.0.0.0');