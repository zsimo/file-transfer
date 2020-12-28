"use strict";

var path = require("path");
var fs = require("fs");
var filesDir =  path.resolve(process.cwd(), "receivers", "files");
fs.mkdirSync(filesDir, {recursive: true});


// Require the framework and instantiate it
var fastify = require('fastify')();


// fastify.addContentTypeParser('*', function (req, done) {
//     done()
// })
fastify.addContentTypeParser(['*'], function (request, payload, done) {
    done();
});

// in a Node.js based HTTP server, request is a readable stream and response is a writable stream.
// see https://nodesource.com/blog/understanding-streams-in-nodejs/
fastify.post('/file', function (request, reply) {

    console.log(request.headers)
;
    var totalLength = parseInt(request.headers["content-length"], 10);
    var fileName = request.headers["content-disposition"].split(";")[1].split("=")[1];
    var writer = fs.createWriteStream(path.resolve(filesDir, fileName));

    var downloaded = 0;
    var start = Date.now();
    var readableStream = request.raw;
    readableStream.on("data", function (chunk) {
        downloaded += chunk.length;
        var percent = Math.round((downloaded / totalLength) * 100) + "%";
        console.log(`receiving ${fileName} ${percent}`);
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
fastify.listen(4001, "0.0.0.0", function (err, address) {
    if (err) {
        fastify.log.error(err)
        process.exit(1)
    }
    fastify.log.info(`server listening on ${address}`)
})