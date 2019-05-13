var roomId;
var userId;

var socket = io();

socket.on('show_notification', function(data) {
    showNotification(data);
/*    var div1 = document.getElementById('chat');
    var div2 = document.createElement('div');
    div1.appendChild(div2);
    div2.style.backgroundColor = 'rgb(220,213,216)';
    //var whoisit = (who == userId) ? 'me' : who;
    //div2.innerHTML = '<br/>' + whoisit + ': ' + text + '<br/><br/>';
    div2.innerHTML = '<br/>' + text + '<br/><br/>';*/
});

function setNotification() {
    showNotification('Notification shown!');
    sendNotification('My Notification', 'I am here!');
}

var Notification = window.Notification;
Notification.requestPermission(function(permission) {

});

function requestNotificationPermission() {
    if (Notification.permission !== 'denied') {
        Notification.requestPermission(function (permission) {
            
        });
    }
}

function showNotification(message, timeout) {
    if (!timeout) {
        timeout = 4000;
    }
    requestNotificationPermission();
    var instance = new Notification(message);
    instance.onclick = function () {
    }
    instance.onerror = function () {
    }
    instance.onshow = function () {
    }
    instance.onclose = function () {
    }
    setTimeout(instance.close.bind(instance), timeout)
}

function sendNotification(title, message) {
    socket.emit('new_notification', message)
};

function sendText() {
    var input = document.getElementById('text');
    //console.log('input: ' , input);
    var text = input.value;
    //console.log('text: ' , text);
    if (text == '')
        return false;
    socket.emit('sendchat', text);
    input.value = '';
    return false;
}

function initRoom() {
    var randomId = 'User' + Math.floor((Math.random() * 10000) + 1);
    userId = prompt("Please enter your name", randomId);
    //if cancel is selected
    if (userId == null) userId = randomId;

    var randomRoomId = Math.floor((Math.random() * 10000) + 1);
    roomId = prompt("What room would you like to join?", randomRoomId);
    //if cancel is selected
    if (roomId == null) roomId = randomRoomId;
    socket.emit('joining', userId, roomId);
    document.getElementById('roomNo').innerHTML = 'You are in room: ' + roomId;
}