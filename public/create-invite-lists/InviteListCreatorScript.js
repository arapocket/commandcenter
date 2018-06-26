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
    }

}


