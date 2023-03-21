#!/usr/bin/env node

const { Http2ServerRequest } = require('http2')
var http = require('http')

async function start() {
  // 如果需要手动修改anonymous_token，需要注释generateConfig调用
  require('./server').serveNcmApi({
    checkVersion: true,
  })
}
// http.createServer(app).listen(8033, () => { console.log("3002端口"); });
// http.createServer(app).listen(process.env.PORT);
start()
