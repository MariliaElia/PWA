exports.init = function (io, appX) {
    io.on('connection', function (socket) {
        console.log('connected');
        socket.on('sendcomment', function(message) {
            console.log(message);
            socket.emit('sendcomment', message);
        });
        /*socket.on('joining', function(userID,roomID) {
            console.log(userID,roomID);
            socket.join(roomID);
        });*/
    });
}