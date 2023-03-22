const socket = io('http://localhost:8002')
socket.on('send', data => {
    console.log(data)
})
$('#avatar-box li').on('click', function () {
    $(this).addClass('now').siblings().removeClass('now')
})
$('#login-btn').on('click', function () {
    let username = $('#user-name').val().trim()
    if (!username) {
        alert('请输入用户名')
        return
    }
    let avatar = $('#avatar-box li.now').text()
    // 登录
    socket.emit('login', {
        username: username,
        avatar: avatar,
    })
    // 广播
    socket.on('hello', data => {
        $('.chat-content').append(`<div>${data}</div>`)
    })
    socket.on('bye', data => {
        $('.chat-content').append(`<div>${data}</div>`)
    })
    // 用户列表
    socket.on('userList', data => {
        // 先将列表清空
        $('.user-num').html('')
        $('.user-list').html('')
        $('.user-num').append(`<span>(${data.length})</span>`)
        // 循环渲染
        for (let i = 0; i < data.length; i++) {
            let temp = `<li>${data[i].username}</li>`
            $('.user-list').append(temp)
        }
    })
    // 登录页面渐渐淡出
    $('.model').fadeOut()
    $('.chatroom').fadeIn()
    // 展示数据
    $('.userInfo-avatar').text(avatar)
    $('.userInfo-username').text(username)
})

$('#btn-send').on('click', function () {
    let content = $('#input-area').val()
    console.log(content)
    if (!content) alert('请输入内容')
    socket.emit('sendMessage', {
        msg: content,
        user: $('#user-name').val().trim(),
    })
})

socket.on('message', data => {
    $('.chat-content').append(`<div>${data.user}:${data.msg}</div>`)
    $('.chat-content').children(':last').get(0).scrollIntoView()
})

$('#input-file').attr('title', '选择12121文件')
$('#input-file').attr('aria-label', '选择31212文件')

$('#input-file').on('change', function () {
    let file = this.files[0]
    let fr = new FileReader()
    // 将文件转为 base64 编码
    fr.readAsDataURL(file)
    fr.onload = function () {
        console.log(fr.result)
        socket.emit('sendPic', {
            pic: fr.result,
            user: $('#user-name').val().trim(),
        })
    }
})

socket.on('picture', data => {
    $('.chat-content').append(
        `<div>${data.user}:<br /><img src="${data.pic}" style="width:300px;height:300px;" /></div>`
    )
    $('.chat-content').children(':last').get(0).scrollIntoView()
})
