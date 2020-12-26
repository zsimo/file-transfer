"use strict";

var path = require("path");
var request = require("request");
var config = require(path.resolve(process.cwd(), "config"));
var fs = require("fs");
var filesDir =  path.resolve(process.cwd(), "receivers", "files");
fs.mkdirSync(filesDir, {recursive: true});
var start = Date.now();

var url = config.RECEIVER_URL;
var file = path.resolve(process.cwd(), "senders", "files", "video.webm");
var fileLength = fs.statSync(file).size;

var r = request.post(url, {
    headers: {
        "Content-Length": fileLength,
        "content-disposition": "attachment; filename=" + path.basename(file)
    }
});

// see https://gist.github.com/moeiscool/2d41335b7a87f8f273e2ea219519c09c
var upload = fs.createReadStream(file);

upload.pipe(r);

var upload_progress = 0;
upload.on("data", function (chunk) {
    upload_progress += chunk.length
    var percent = Math.round((upload_progress / fileLength) * 100) + "%";
    console.log(upload_progress, percent);
})

upload.on("end", function (res) {
    console.log('Finished in ' + (Date.now() - start) + "ms");
})