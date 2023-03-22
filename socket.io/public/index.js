const socket = io('http://localhost:8002')
socket.on('send', (data) => {
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
    socket.on('hello', (data) => {
        $('.chat-content').append(`<div>${data}</div>`)
    })
    // 用户列表
    socket.on('userList', (data) => {
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
