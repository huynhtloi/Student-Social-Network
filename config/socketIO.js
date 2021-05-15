const io = require("socket.io")();
const socketIO = {
    io: io
};

// Add your socket.io logic here!
io.on("connection", function (client) {

    let users = Array.from([])

    // server lắng nghe dữ liệu từ client
    client.on('register-id', data => {

        // lấy data từ client sau khi lắng nghe từ server
        let { socketId, userId } = data;
        client.id = socketId

        // Sau khi lắng nghe dữ liệu, server phát lại dữ liệu này đến các client khác
        client.broadcast.emit('register-id', { socketId: socketId.id, userId: userId })
        users.push({ socketId: socketId, userId: userId })
        // console.log("log nay o socketIO.js")
        // console.log(users)
    })
    client.emit('list-users', users)
});
// end of socket.io logic

module.exports = socketIO;