const { createServer } = require('http')
const { Server } = require('socket.io')
const app = createServer()
const io = new Server(app, {})
const PORT = 8002
const operation = {
    IN: 0,
    LEAVE: 1,
    ONLINE: 2,
}

let count = 0
io.on('connection', (socket) => {
    console.log('用户连接')
    count++
    socket.userName = count
    socket.emit('send', {
        type: operation.IN,
        msg: `用户${conn.userName}进入了聊天室`,
        time: new Date().toLocaleDateString(),
    })
})
app.listen(PORT, () => {
    console.log(`服务在${PORT}端口运行`)
})
