function loadScripts() {

    var newButton = document.getElementById('newButton');
    newButton.addEventListener('click', function () {
        newButtonPressed();
    })

    var templateButton = document.getElementById('templateButton');
    templateButton.addEventListener('click', function () {
    })



    function createID() {
        var newID = Math.random().toString(36).substr(2, 9);
        return newID;
    }

    function newButtonPressed(){
        templateButton.style.display = 'none';
        newButton.style.display = 'none';

        var xhr = new XMLHttpRequest();

        if (!xhr) {
            alert('Giving up :( Cannot create an XMLHTTP instance');
            return false;
        }

        xhr.open("GET", "http://ec2-34-215-115-69.us-west-2.compute.amazonaws.com:3000/createinvitelist", true);
        xhr.send(null);
    }

}


