/**
 * socket io file
 * performing socket functionality for posting comments on stories
 * @param io
 * @param appX
 */

exports.init = function (io, appX) {
    io.on('connection', function (socket) {

        console.log('connected');

        socket.on('sendcomment', function(message) {
            console.log(message);
            socket.emit('sendcomment', message);
        });
    });
}