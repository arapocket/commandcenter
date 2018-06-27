function loadScripts() {

    var startButton = document.getElementById('startButton');
    startButton.addEventListener('click', function () {
        startButtonPressed();
    })

    function createID() {
        var newID = Math.random().toString(36).substr(2, 9);
        return newID;
    }

    function startButtonPressed(){
        startButton.innerHTML = "<p> cock </p>"
    }

}


