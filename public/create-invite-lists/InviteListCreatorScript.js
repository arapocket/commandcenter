function loadScripts() {

    var startButton = document.getElementById('startButton');
    startButton.addEventListener('click', function () {
        startButtonPressed();
    })

    var jumbotronContent = document.getElementById('jumbotronContent')

    var input = document.getElementById('input');

    function createID() {
        var newID = Math.random().toString(36).substr(2, 9);
        return newID;
    }

    function startButtonPressed(){
        jumbotronContent.style.display = 'none';
        input.style.display = 'block';
    }

}


