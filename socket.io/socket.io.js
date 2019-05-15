exports.init = function (io, appX) {
    io.on('connection', function (socket) {

        console.log('connected');

        socket.on('sendcomment', function(message) {
            console.log(message);
            socket.emit('sendcomment', message);
        });

/*        fs.readFile('image.png', function (err, data) {
            socket.emit('imageConversionByClient', {image: true, buffer:data});
            //socket.emit('imageConversionByServer', "data:image/png;base64,"+ data.toString("base64"));
        });*/

        /*socket.on('joining', function(userID,roomID) {
            console.log(userID,roomID);
            socket.join(roomID);
        });*/
    });
}