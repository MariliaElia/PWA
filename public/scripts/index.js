window.onscroll = function() {scrollFunction()};

function scrollFunction() {
    if (document.body.scrollTop > 50 || document.documentElement.scrollTop > 50) {
        document.getElementById("title").style.fontSize = "30px";
    } else {
        document.getElementById("title").style.fontSize = "90px";
    }
}