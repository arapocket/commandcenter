function loadScripts() {

    var createButton = document.getElementById('createButton');

    createButton.addEventListener('click', function () {
        postList();
        console.log(dataArray);
    })





    function postList() {
        var xhr = new XMLHttpRequest();

        if (!xhr) {
            alert('Giving up :( Cannot create an XMLHTTP instance');
            return false;
        }

        xhr.open("POST", "http://ec2-34-215-115-69.us-west-2.compute.amazonaws.com:3000/createinvitelist", true);

        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.send(JSON.stringify({

        }));
    }

}


