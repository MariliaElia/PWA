/**
 * users can comment on stories
 * this is done by the use of socket.io
 */

var socket = io();

/**
 * this prints the comment
 * communicates with socket.io file
 */
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

/**
 * sendComment
 * gets comment from users input onto form
 * @returns {boolean}
 */
function sendComment() {
    var input = document.getElementById('comment');
    var usercomment = input.value;
    if (usercomment == '')
        return false;
    socket.emit('sendcomment', usercomment);
    input.value = '';
    return false;
}

/**
 * Get data from comments form
 * @param url
 * @param data
 */
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

/**
 * Send ajax query for comment form data
 * @param url
 * @param data
 */
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