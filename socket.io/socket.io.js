exports.init = function (io, appX) {
    io.on('connection', function (socket) {
        socket.on('new_notification', function(message) {
            //console.log(message)
            io.emit('show_notification', message)
        });
    });
}