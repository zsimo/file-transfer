"use strict";

var path = require("path");
var fs = require("fs");
var config = require(path.resolve(process.cwd(), "config"));
var common = require(path.resolve(process.cwd(), "senders", "common"));
var url = new URL(config.HTTP_RECEIVER_URL);
var filesDir = common.createOutputDir();

var fastify = require("fastify")();

fastify.addContentTypeParser(["*"], function (request, payload, done) {
    done();
});

// in a Node.js based HTTP server, request is a readable stream and response is a writable stream.
// see https://nodesource.com/blog/understanding-streams-in-nodejs/
fastify.post('/file', function (request, reply) {

    console.log(request.headers);
    var totalLength = parseInt(request.headers["content-length"], 10);
    var fileName = request.headers["content-disposition"].split(";")[1].split("=")[1];
    var writer = fs.createWriteStream(path.resolve(filesDir, fileName));

    var downloaded = 0;
    var start = Date.now();
    var readableStream = request.raw;
    readableStream.on("data", function (chunk) {
        downloaded += chunk.length;
        var percent = Math.round((downloaded / totalLength) * 100) + "%";
        console.log(`receiving ${fileName} ${percent}, ${(downloaded / (1024 * 1024)).toFixed(2)}mb\``);
    });
    writer.on("finish", function () {
        console.log("writer finish")
        console.log(`receiving ${fileName} terminated in ${Date.now() - start}ms`);
        reply.send({
            status: "ok"
        })
    });
    readableStream.pipe(writer);

})

// Run the server!
fastify.listen(url.port, "0.0.0.0", function (err, address) {
    if (err) {
        fastify.log.error(err)
        process.exit(1)
    }
    fastify.log.info(`server listening on ${address}`)
})