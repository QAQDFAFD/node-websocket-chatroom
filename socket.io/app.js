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

// 用户列表
let userList = []
// 注意这是单个用户
io.on('connection', socket => {
    console.log('连接成功')
    socket.emit('send', {
        type: operation.IN,
        msg: '有人进入了聊天室',
        time: new Date().toLocaleDateString(),
    })
    // 登录事件
    socket.on('login', data => {
        //包含用户的用户名和头像
        // 检查用户是否已经登陆
        let user = userList.find(item => item.username === data.username)
        if (user) console.log('用户已经登录')
        else {
            userList.push(data)
            socket.username = data.username
            socket.avatat = data.avatar
            console.log('用户登录成功')
            // 告诉所有的用户，有人加入了聊天室
            socket.broadcast.emit('hello', `${data.username}加入了聊天室`)
            // 将用户列表返回
            io.emit('userList', userList)
        }
    })
    // 用户离开了房间
    socket.on('disconnect', function () {
        userList = userList.filter(item => item.username !== socket.username)
        socket.broadcast.emit('bye', `${socket.username}离开了聊天室`)
        io.emit('userList', userList)
    })
    // 监听聊天
    socket.on('sendMessage', data => {
        // 将聊天内容广播给所有的用户
        io.emit('message', {
            user: data.user,
            msg: data.msg,
        })
    })
    socket.on('sendPic', data => {
        // 将聊天内容广播给所有的用户
        io.emit('picture', {
            user: data.user,
            pic: data.pic,
        })
    })
})

httpServer.listen(PORT, () => {
    console.log(`您的服务正在${PORT}端口运行`)
})
