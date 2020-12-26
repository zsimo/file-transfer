"use strict";

var path = require("path");
var request = require('request');
var fs = require("fs");
var start = Date.now();

var url = "http://localhost:4001/file";
var r = request.post(url);
// See http://nodejs.org/api/stream.html#stream_new_stream_readable_options
// for more information about the highWaterMark
// Basically, this will make the stream emit smaller chunks of data (ie. more precise upload state)
var upload = fs.createReadStream(path.resolve(process.cwd(), "senders", "files", "valery.zip"));

upload.pipe(r);

var upload_progress = 0;
upload.on("data", function (chunk) {
    upload_progress += chunk.length
    console.log(new Date(), upload_progress);
})

upload.on("end", function (res) {
    console.log('Finished in ' + (Date.now() - start) + "ms");
})