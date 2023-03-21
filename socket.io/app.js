const express = require('express')
const { createServer } = require('http')
const { Server } = require('socket.io')
const app = express()
const PORT = 8002
const httpServer = createServer(app)
const io = new Server(httpServer, {})
const operation = {
    IN: 0,
    LEAVE: 1,
    ONLINE: 2,
}
const path = require('path')
// 访问静态模块
app.use(express.static(path.join(__dirname, 'public')))

app.get('/', function (req, res) {
    res.sendFile(__dirname + '/index.html')
})

io.on('connection', (socket) => {
    console.log('连接成功')
    socket.emit('send', {
        type: operation.IN,
        msg: '有人进入了聊天室',
        time: new Date().toLocaleDateString(),
    })
    // 登录事件
    socket.on('login', (data) => {
        console.log(data)
    })
})

httpServer.listen(PORT, () => {
    console.log(`您的服务正在${PORT}端口运行`)
})
