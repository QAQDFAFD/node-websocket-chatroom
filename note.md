# websocket

> 技术栈：nodejs，websocket 相关知识

![image-20230320190710115](https://picgo-use-images.oss-cn-shanghai.aliyuncs.com/images/image-20230320190710115.png)

## 传统的基于http请求的实现

基本上是可以是实现从小帅到服务器，但是传统的前后端开发时没有办法主动从服务器向小美发送信息的。

## websocket相关知识

websocket 是一种基于 tcp 的一种新的网络协议，它实现了浏览器与服务器的<span style="color:red">全双工</span>通信，即允许服务器主动发送信息给客户端。

并且 websocket 是一种长连接，是一种持久协议，http 是一种非持久协议。

![image-20230320191414035](https://picgo-use-images.oss-cn-shanghai.aliyuncs.com/images/image-20230320191414035.png)

> 这也解释了 websocket 和 http 之间的区别 和 websocket 的使用场景。

相比于 **使用Ajax轮询** ，使用 websocket 的性能消耗是更小的。

## websocket的基本使用

### 基本事件

| 基本事件 |     处理事件     |            描述            |
| :------: | :--------------: | :------------------------: |
|   open   |  socket.onopen   |       建立连接时触发       |
| message  | socket.onmessage | 客户端接受服务端数据时触发 |
|  error   |  socket.onerror  |   通信发生错误的时候触发   |
|  close   |  socker.onclose  |       连接关闭时触发       |

### 基本方法

|      方法      |       描述       |
| :------------: | :--------------: |
| socket.send()  | 使用连接发送数据 |
| socket.close() |     关闭连接     |

### 检查websocket

![image-20230320195252282](https://picgo-use-images.oss-cn-shanghai.aliyuncs.com/images/image-20230320195252282.png)

![image-20230320195304987](https://picgo-use-images.oss-cn-shanghai.aliyuncs.com/images/image-20230320195304987.png)

### socket服务器返回的数据

![image-20230320195509211](https://picgo-use-images.oss-cn-shanghai.aliyuncs.com/images/image-20230320195509211.png)

### 代码实现

```js
<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="UTF-8" />
        <meta http-equiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Document</title>
    </head>
    <body>
        <input type="text" placeholder="请输入你的内容" />
        <button>send</button>
        <div style="width: 100px; height: 100px; border: 2px solid deeppink; margin-top: 20px"></div>
    </body>
    <script>
        // 获取一系列对象
        const input = document.querySelector('input')
        const button = document.querySelector('button')
        const div = document.querySelector('div')
        // 创建websocket对象
        // 参数1：websocket服务地址
        const socket = new WebSocket('ws://localhost:8080/lijiajun')
        // 当连接成功的时候，就会触发
        socket.addEventListener('open', function () {
            alert('success')
            div.innerHTML = '连接成功！'
        })
        // 主动给websocket发消息
        button.addEventListener('click', function () {
            let value = input.value
            socket.send(value)
        })
        // 通信发生错误的时候触发
        socket.addEventListener('error', function (e) {
            div.innerHTML = '连接失败！'
        })
        socket.addEventListener('message', function (e) {
            console.log(e.data)
        })
    </script>
</html>
```

效果：

![image-20230320200703611](https://picgo-use-images.oss-cn-shanghai.aliyuncs.com/images/image-20230320200703611.png)

## nodejs开发websocket服务

使用了`NodejsWebsocket`这个包。[传送门]([nodejs-websocket - npm (npmjs.com)](https://www.npmjs.com/package/nodejs-websocket))

> 其实就是为了方便开发，使用原生的方式开发也是完全可以的。

### 服务端基本代码实现

```js
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
```

### 前端代码实现

```html
<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="UTF-8" />
        <meta http-equiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Document</title>
    </head>
    <body>
        <input type="text" placeholder="请输入你的内容" />
        <button>send</button>
        <div style="width: 300px; height: 300px; border: 2px solid deeppink; margin-top: 20px"></div>
    </body>
    <script>
        // 获取一系列对象
        const input = document.querySelector('input')
        const button = document.querySelector('button')
        const div = document.querySelector('div')
        // 创建websocket对象
        // 参数1：websocket服务地址
        const socket = new WebSocket('ws://localhost:8001')
        // 当连接成功的时候，就会触发
        socket.addEventListener('open', function () {
            console.log('success')
            div.innerHTML = '连接成功！'
        })
        // 主动给websocket发消息
        button.addEventListener('click', function () {
            let value = input.value
            socket.send(value)
        })
        // 通信发生错误的时候触发
        socket.addEventListener('error', function (e) {
            div.innerHTML = '连接失败！'
        })
        socket.addEventListener('message', function (e) {
            console.log(e.data)
            let data = JSON.parse(e.data)
            let dv = document.createElement('div')
            switch (data.type) {
                case 0:
                    dv.style.color = 'green'
                    break
                case 1:
                    dv.style.color = 'red'
                    break
                case 0:
                    dv.style.color = 'black'
                    break
            }
            dv.innerHTML = data.msg + ' ' + data.time
            div.append(dv)
        })
    </script>
</html>
```

## socket.io的使用

**什么是 socket.io ？**

Socket.IO 是一个库，可以在客户端和服务器之间实现 **低延迟**, **双向** 和 **基于事件的** 通信。它建立在 websocket 协议之上，并提供额外的保证，例如回退到 HTTP 长轮询或自动重新连接。

## 代码实现

> 以下是最基础的代码实现。
>
> 核心在于事件。

index.html

```html
<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="UTF-8" />
        <meta http-equiv="X-UA-Compatible" content="text/html; />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Document</title>
    </head>
    <body>
        哈哈
        <script src="/socket.io/socket.io.js"></script>
        <script>
            const socket = io('http://localhost:8002')
            socket.on('send', (data) => {
                console.log(data)
            })
        </script>
    </body>
</html>
```

app.js

```js
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

app.get('/', function (req, res) {
    res.sendFile(__dirname + '/index.html')
})

io.on('connection', (socket) => {
    console.log('连接成功')
    socket.emit('send', { type: operation.IN, msg: '有人进入了聊天室', time: new Date().toLocaleDateString() })
})

httpServer.listen(PORT, () => {
    console.log(`您的服务正在${PORT}端口运行`)
})
```

# 聊天室项目

## 登录功能

