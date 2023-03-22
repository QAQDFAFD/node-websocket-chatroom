const socket = io('http://localhost:8002')
socket.on('send', (data) => {
    console.log(data)
})
$('#avatar-box li').on('click', function () {
    console.log('执行')
    $(this).addClass('now').siblings().removeClass('now')
})
$('#login-btn').on('click', function () {
    let username = $('#user-name').val().trim()
    if (!username) {
        alert('请输入用户名')
        return
    }
    let avatar = $('#avatar-box li.now').text()
    console.log(`您选择了头像${avatar}`)
    // 登录
    socket.emit('login', {
        username: username,
        avatar: avatar,
    })
    // 登录页面渐渐淡出
    $('.model').fadeOut()
    $('.chatroom').fadeIn()
    // 展示数据
    $('.userInfo-avatar').text(avatar)
    $('.userInfo-username').text(username)
})
