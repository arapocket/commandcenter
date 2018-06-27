function loadScripts() {

    var startButton = document.getElementById('startButton');
    startButton.addEventListener('click', function () {
        startButtonPressed();
    })

    var jumbotronContent = document.getElementById('jumbotronContent')

    function createID() {
        var newID = Math.random().toString(36).substr(2, 9);
        return newID;
    }

    function startButtonPressed(){
        jumbotronContent.innerHTML = "<p> Who is this invite list for? </p> <input> </input>"

    }

}


