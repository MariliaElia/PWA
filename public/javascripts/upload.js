function readURL(input) {
    if (input.files && input.files[0]) {
        var reader = new FileReader();

        reader.onload = function (e) {
            $('#usrImg')
                .attr('src', e.target.result);
        };

        reader.readAsDataURL(input.files[0]);

        save(input);

    }
}

function save(input) {
    if (input.files && input.files[0]) {
        var reader = new FileReader();

        reader.readAsDataURL(input.files[0]);
        //reader.readAsBinaryString(input.files[0]);
        reader.onload = function(e) {
            let bits = e.target.result;
            console.log('called setFileBits');
            setFileBits(bits);
            //console.log('called getFileBits');
            //getFileBits();
        }

    }
}



function saveFile(e) {
    console.log('saving image as bits');
    let file = e.target.files[0];
    var reader = new FileReader();
    reader.readAsBinaryString(file);

    reader.onload = function(e) {
        //alert(e.target.result);
        let bits = e.target.result;
        setFileBits(bits);

        /*
        let ob = {
            created:new Date(),
            data:bits
        };

        let trans = db.transaction(['cachedForms'], 'readwrite');
        let addReq = trans.objectStore('cachedForms').add(ob);

        addReq.onerror = function(e) {
            console.log('error storing data');
            console.error(e);
        }

        trans.oncomplete = function(e) {
            console.log('data stored');
        }*/
        console.log('file: ' + getFileBits());
    }
}

var fileBits;

function setFileBits(bits) {
    fileBits = bits;
    //fileBits = fileBits.replace("data:image/jpeg;base64,", "");
    //console.log(fileBits);
    //console.log(fileBits);
    //test = fileBits.slice(0,22);
    //console.log(test);
    document.getElementById('bits').value = fileBits;
}

function getFileBits() {
    //console.log(fileBits);
    return fileBits;
}

