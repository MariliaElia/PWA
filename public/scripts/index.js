window.onscroll = function() {scrollFunction()};

function scrollFunction() {
    if (document.body.scrollTop > 50 || document.documentElement.scrollTop > 50) {
        document.getElementById("heading").style.fontSize = "30px";
    } else {
        document.getElementById("heading").style.fontSize = "90px";
    }
}