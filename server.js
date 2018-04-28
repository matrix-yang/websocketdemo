//https://github.com/websockets/ws/blob/master/doc/ws.md#new-wsserveroptions-callback
const http = require('http');
const WebSocket = require('ws');
const url=require('url');

const server = http.createServer();
const wss1 = new WebSocket.Server({ noServer: true });
const wss2 = new WebSocket.Server({ noServer: true });
//广播
wss1.broadcast = function broadcast(s,ws) {
    // console.log(ws);
    // debugger;
    wss1.clients.forEach(function each(client) {
        // if (typeof client.user != "undefined") {
        if(s == 1){
            client.send(ws.name + ":" + ws.msg);
        }
        if(s == 0){
            client.send(ws + "退出聊天室");
        }
        // }
    });
};

wss1.on('connection', function connection(ws) {
    //console.log(ws.clients.session);
    // console.log(wss.clients.size)
    // console.log("在线人数", wss.clients.length);
    ws.send('这是聊天室1，你是第' + wss1.clients.size + '位');
    // 发送消息
    ws.on('message', function(jsonStr,flags) {
        var obj = eval('(' + jsonStr + ')');
        // console.log(obj);
        this.user = obj;
        if (typeof this.user.msg != "undefined") {
            wss1.broadcast(1,obj);
        }
    });
    // 退出聊天
    ws.on('close', function(close) {
        try{
            wss.broadcast(0,this.user.name);
        }catch(e){
            console.log('刷新页面了');
        }
    });
});
//广播
wss2.broadcast = function broadcast(s,ws) {
    // console.log(ws);
    // debugger;
    wss2.clients.forEach(function each(client) {
        // if (typeof client.user != "undefined") {
        if(s == 1){
            client.send(ws.name + ":" + ws.msg);
        }
        if(s == 0){
            client.send(ws + "退出聊天室");
        }
        // }
    });
};

wss2.on('connection', function connection(ws) {
    //console.log(ws.clients.session);
    // console.log(wss.clients.size)
    // console.log("在线人数", wss.clients.length);
    ws.send('这是聊天室2，你是第' + wss2.clients.size + '位');
    // 发送消息
    ws.on('message', function(jsonStr,flags) {
        var obj = eval('(' + jsonStr + ')');
        // console.log(obj);
        this.user = obj;
        if (typeof this.user.msg != "undefined") {
            wss2.broadcast(1,obj);
        }
    });
    // 退出聊天
    ws.on('close', function(close) {
        try{
            wss2.broadcast(0,this.user.name);
        }catch(e){
            console.log('刷新页面了');
        }
    });
});

server.on('upgrade', function upgrade(request, socket, head) {
    //console.log(request.getParameter('group'))
    const pathname = url.parse(request.url).pathname;
    if (pathname === '/foo') {
        wss1.handleUpgrade(request, socket, head, function done(ws) {
            wss1.emit('connection', ws);
        });
    } else if (pathname === '/bar') {
        wss2.handleUpgrade(request, socket, head, function done(ws) {
            wss2.emit('connection', ws);
        });
    } else {
        socket.destroy();
    }
});
server.listen(3000);
