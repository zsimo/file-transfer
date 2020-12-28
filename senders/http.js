"use strict";

var path = require("path");
var request = require("request");
var config = require(path.resolve(process.cwd(), "config"));
var fs = require("fs");
var filesDir =  path.resolve(process.cwd(), "receivers", "files");
fs.mkdirSync(filesDir, {recursive: true});
var start = Date.now();

var url = config.RECEIVER_URL;
var file = path.resolve(process.cwd(), "senders", "files", "video01.mp4");
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
    console.log(`sending ${fileName} terminated in ${Date.now() - start}ms`);
})