const http = require("http");
const url = require("url");
const querystring = require("querystring");
const fs = require("fs");
const path = require("path");

let server = http.createServer((req, res) => {
  //处理get数据
  let { pathname, query } = url.parse(req.url, true);
  let getFileUrl = path.join(__dirname, "../www", pathname);

  // console.log(pathname, query);
  // console.log(req.socket.remotePort); //NET 模块下 socket.remotePort 获取客户端的端口号

  /**
   * 请求头数据
   *   req.headers
   */

  console.log(req.headers);

  /**
   * 处理post body数据
   *  一般大的数据包会分成很多小包进行处理
   *  当收到一个数据包会触发data事件
   */

  let str = "";
  req.on("data", (data) => {
    str += data;
  });

  res.setHeader("Content-Type", "text/plain;charset=utf-8"); //设置编码,否则默认 buffer

  //接收结束了就会触发end事件
  req.on("end", () => {
    console.log(str, 111);
    let post = JSON.parse(str); // 解析body的数据
    console.log(post, 222);

    //操作数据
    switch (pathname) {
      case "/":
        res.write("根目录");
        res.end();
        break; //注册
      case "/reg":
        res.write("reg");
        res.end();
        break; //注册
      case "/login":
        res.end("login");
        break; //登录
      case "/readimg.jpg":
        fs.readFile(getFileUrl, (err, data) => {
          if (err) {
            res.writeHeader(404); //设置状态码
            res.write("err"); //写入页面的内容
          } else {
            /**
             * 不同资源 Content-Type 不一样的,图片不需要指定编码
             */
            res.setHeader("Content-Type", "image/jpeg"); //设置编码
            res.write(data);
          }
          res.end();
        });
        break;
      default:
        //其他
        fs.readFile(getFileUrl, (err, data) => {
          if (err) {
            res.writeHeader(404); //设置状态码
            res.write("errr"); //写入页面的内容
          } else {
            console.log(data);
            res.writeHeader(200, {
              "content-type": "text/html", //设置返回的数据的类型
            });
            res.write(data);
          }
          res.end(); //告诉浏览器结束了 不然会一直转 尽量不要放在异步回调外面,先结束了回调里会出错的
        });
    }
  });

  // res.end();
});

server.listen(8080, () => console.log("server 8080"));
