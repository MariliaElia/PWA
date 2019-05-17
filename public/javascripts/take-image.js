/**
 * webrtc image taking javascript
 * uses the webcam to take photo
 * @type {number}
 */

var width = 280;    // We will scale the photo width to this
var height = 0;     // This will be computed based on the input stream

var streaming = false;

var video = null;
var canvas = null;
var photo = null;

/**
 * startup
 * initialises the camera
 */
function startup() {
    video = document.getElementById('video');
    canvas = document.getElementById('canvas');
    startbutton = document.getElementById('startbutton');
    photo = document.getElementById('photo');

    navigator.mediaDevices.getUserMedia({ video: true, audio: false })
        .then(function(stream) {
            video.srcObject = stream;
            video.play();
            console.log('stream started');
        })
        .catch(function(err) {
            console.log("An error occurred: " + err);
        });

    video.addEventListener('canplay', function(ev){
        if (!streaming) {
            height = video.videoHeight / (video.videoWidth/width);

            video.setAttribute('width', width);
            video.setAttribute('height', height);
            canvas.setAttribute('width', width);
            canvas.setAttribute('height', height);
            streaming = true;
        }
    }, false);

    startbutton.addEventListener('click', function(ev){
        takepicture();
        ev.preventDefault();
    });

    clearphoto();
}

/**
 * clears photo in canvas if new one taken
 */
function clearphoto() {
    var context = canvas.getContext('2d');
    context.fillStyle = "#AAA";
    context.fillRect(0, 0, canvas.width, canvas.height);
    var data = canvas.toDataURL('image/png');
    photo.setAttribute('src', data);
}

/**
 * capture the image
 * save its data in a hidden input
 * where mongodb can get from and save
 */
function takepicture() {
    var context = canvas.getContext('2d');
    if (width && height) {
        canvas.width = width;
        canvas.height = height;
        context.drawImage(video, 0, 0, width, height);

        var imgdata = canvas.toDataURL('image/png');
        photo.setAttribute('src', imgdata);

        document.getElementById('imgdata').value = imgdata;

    } else {
        clearphoto();
    }

}

/**
 * stops the camera and closes it on the browser
 */
function stop() {
    video = document.getElementById('video');
    navigator.mediaDevices.getUserMedia({ video: true, audio: false })
        .then(function(stream) {
            var track = stream.getTracks()[0];
            track.stop();
            video.srcObject = null;
            console.log('Stream ended');
        })
        .catch(function(err) {
            console.log("An error occurred: " + err);
        });
    document.location.reload()
}