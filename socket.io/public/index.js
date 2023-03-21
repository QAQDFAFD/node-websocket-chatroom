const socket = io('http://localhost:8002')
socket.on('send', (data) => {
    console.log(data)
})
$('#avatar-box li').on('click', function () {
    console.log('执行')
    $(this).addClass('now').siblings().removeClass('now')
})
