var express = require("express");
var app = express();

var http = require("http").Server(app);
var io = require("socket.io")(http);
var port = process.env.PORT || 3001;
var ss = require("socket.io-stream");
var path = require("path");
var fs = require("fs");

app.use(express.static(__dirname + "/static"));

app.get("/", function (req, res) {
    res.sendFile(__dirname + "/index.html");
});

let connects = [];

io.on("connection", function (socket) {
    connects.push(socket);
    console.log(`有人连接,当前连接人数${connects.length}`);

    socket.on("chat message", function (msg) {
        io.emit("chat message", msg); //广播给所有链接用户
        socket.emit("chat message", msg); //发送给自己
    });
    ss(socket).on("multiple-streams", function (stream, data) {
        console.log("==========================================");
        // var filename = path.basename(data.name);
        // stream.pipe(fs.createWriteStream(filename));
        console.log(stream)

        console.log("==========================================");
        //io.emit("streamuser", msg); //广播给所有链接用户
    });
    socket.on("disconnect", (reason) => {
        connects.splice(connects.indexOf(socket), 1);
        console.log(`${reason} 连接断开了`);
    });
    socket.on("disconnecting", (reason) => {
        //socket正在断开
        console.log(socket.rooms); // Set { ... }
    });
});

http.listen(port, function () {
    console.log("listening on *:" + port);
});
