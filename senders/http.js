"use strict";

var path = require("path");
var request = require("request");
var config = require(path.resolve(process.cwd(), "config"));
var common = require(path.resolve(process.cwd(), "senders", "common"));
var fs = require("fs");

var start = Date.now();
var url = config.HTTP_RECEIVER_URL;
var file = common.getInputFilePath();
var fileLength = fs.statSync(file).size;
var fileName =  path.basename(file);

var r = request.post(url, {
    headers: {
        "Content-Length": fileLength,
        "content-disposition": "attachment; filename=" + fileName
    }
}, function (reserr, response, body) {
    console.log("response:", response.statusCode, body);
});

// see https://gist.github.com/moeiscool/2d41335b7a87f8f273e2ea219519c09c
var reader = fs.createReadStream(file);

reader.pipe(r);

var upload_progress = 0;
reader.on("data", function (chunk) {
    upload_progress += chunk.length
    var percent = Math.round((upload_progress / fileLength) * 100) + "%";
    console.log(`sending ${fileName} ${percent}`);
})

reader.on("end", function (res) {
    var elapsed = Date.now() - start;
    console.log(`sending ${fileName} terminated in ${Date.now() - start}ms`);
    console.log(`speed was: ${((fileLength / (1024 * 1024)) / (elapsed / 1000)).toFixed(2)} MB/s`);
})