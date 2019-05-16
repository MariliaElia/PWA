var socket = io();

socket.on('sendcomment', function (comment) {
    var div1 = document.getElementById('comments');
    var div2 = document.createElement('div');
    var userDiv = document.getElementById('username');
    var username = userDiv.innerHTML;
    div1.appendChild(div2);
    div2.style.backgroundColor = 'rgb(245,245,245)';
    div2.style.border = 'solid 1px rgb(220,220,220)';
    div2.style.padding = '3px';
    div2.style.lineHeight = '30px';
    div2.style.width = '70%';
    div2.innerHTML = comment + ' -' + username;
    onCommentSubmit('/view-story', comment);
});

function sendComment() {
    var input = document.getElementById('comment');
    var usercomment = input.value;
    if (usercomment == '')
        return false;
    socket.emit('sendcomment', usercomment);
    input.value = '';
    return false;
}

function onCommentSubmit(url, data) {
    console.log("in onsubmit, data: " + data);
    var formArray = $("form").serializeArray();
    var formdata = {};
    formdata['comment'] = data;
    for (index in formArray){
        formdata[formArray[index].name]= formArray[index].value;
    }
    sendCommentAjaxQuery(url, formdata);
}

function sendCommentAjaxQuery(url, data) {
    $.ajax({
        url: url ,
        data: data,
        dataType: 'json',
        type: 'POST',
        success: function (dataR) {

            console.log('in ajax query');

            var ret = dataR;
            console.log(dataR);

        },
        error: function (xhr, status, error) {
            alert('Error: ' + error.message);
        }
    });
}