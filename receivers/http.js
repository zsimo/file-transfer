"use strict";

var path = require("path");
var fs = require("fs");
var filesDir =  path.resolve(process.cwd(), "receivers", "files");
fs.mkdirSync(filesDir, {recursive: true});


// Require the framework and instantiate it
var fastify = require('fastify')();


fastify.addContentTypeParser('*', function (req, done) {
    done()
})

fastify.post('/file', function (request, reply) {
    var writer = fs.createWriteStream(path.resolve(filesDir, "valery.zip"));
    console.log(request.headers)
    request.raw.pipe(writer);
    writer.on("finish", function () {
        console.log("writer finish")
        reply.send({
            status: "ok"
        })
    });

})
fastify.get('/file', function (request, reply) {
    // request.req.pipe(fs.createWriteStream(path.resolve(filesDir, "valery.zip")));
    reply.send({
        status: "ok"
    })
})


// Run the server!
fastify.listen(4001, function (err, address) {
    if (err) {
        fastify.log.error(err)
        process.exit(1)
    }
    fastify.log.info(`server listening on ${address}`)
})