function loadScripts() {

    var startButton = document.getElementById('startButton');
    startButton.addEventListener('click', function () {
        startButtonPressed();
    })

    var buttonDiv = document.getElementById('buttonDiv')

    function createID() {
        var newID = Math.random().toString(36).substr(2, 9);
        return newID;
    }

    function startButtonPressed(){
        buttonDiv.innerHTML = "<p> cock </p>"
    }

}


