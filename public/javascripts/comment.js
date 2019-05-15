var socket = io();

socket.on('sendcomment', function (comment) {
    var div1 = document.getElementById('comments');
    var div2 = document.createElement('div');
    div1.appendChild(div2);
    div2.style.backgroundColor = 'rgb(245,245,245)';
    div2.style.border = 'solid 1px rgb(220,220,220)';
    div2.style.padding = '3px';
    div2.style.lineHeight = '30px';
    div2.style.width = '70%';
    div2.innerHTML = comment + ' ~username';
});

function sendComment(comment) {
    var input = document.getElementById('comment');
    var usercomment = input.value;
    if (usercomment == '')
        return false;
    socket.emit('sendcomment', usercomment);
    input.value = '';
    return false;
}