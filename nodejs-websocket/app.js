const ws = require('nodejs-websocket')
const PORT = 8001
const operation = {
    IN: 0,
    LEAVE: 1,
    ONLINE: 2,
}
// 记录当前聊天室的人数
let count = 0
// 开启一个websocket对象
const server = ws
    .createServer(function (conn) {
        // 有新的连接 -> 有新的用户连接了
        console.log('new connection')
        count++
        conn.userName = `用户${count}`
        boardcast({
            type: operation.IN,
            msg: `${conn.userName}进入了聊天室`,
            time: new Date().toLocaleDateString(),
        })
        // 处理用户发过来的信息
        conn.on('text', function (str) {
            console.log('received:', str)
            conn.send('返回的数据')
        })
        // 当连接关闭的时候会触发
        conn.on('close', function () {
            count--
            boardcast({ type: operation.LEAVE, msg: `有人离开了聊天室`, time: new Date().toLocaleDateString() })
            console.log('连接断开')
        })
        // 处理用户断开后的error事件
        conn.on('error', function () {
            console.log('用户连接异常')
        })
    })
    .listen(PORT, () => {
        console.log(`您的服务正在${PORT}端口运行`)
    })

// 顶一个一个广播函数
const boardcast = (p) => {
    server.connections.forEach((item) => {
        // 由于websocket值允许发送回字符串，所以需要转换一下
        item.send(JSON.stringify(p))
    })
}
