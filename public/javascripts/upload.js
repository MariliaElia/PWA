/**
 * method for reading the image data as a URL to be saved on the indexedDB
 * @param input
 */
function readURL(input) {
    if (input.files && input.files[0]) {
        var reader = new FileReader();

        // displays image back to user before submittin form
        reader.onload = function (e) {
            $('#usrImg')
                .attr('src', e.target.result);
        };

        reader.readAsDataURL(input.files[0]);
        save(input);

    }
}

/**
 * saving image as bits
 * @param input
 */
function save(input) {
    if (input.files && input.files[0]) {
        var reader = new FileReader();

        reader.readAsDataURL(input.files[0]);
        reader.onload = function(e) {
            let bits = e.target.result;
            setFileBits(bits);
        }

    }
}

var fileBits;

/**
 * saves the bits in a hidden tag in the form to send to ajax query before form submission
 */
function setFileBits(bits) {
    fileBits = bits;
    document.getElementById('bits').value = fileBits;
}



