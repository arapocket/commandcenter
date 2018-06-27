function loadScripts() {

    var button = document.getElementById('button');
    button.addEventListener('click', function () {
        buttonPressed();
    })

    var jumbotronContent = document.getElementById('jumbotronContent')

    var input = document.getElementById('input');

    function createID() {
        var newID = Math.random().toString(36).substr(2, 9);
        return newID;
    }

    function buttonPressed(){
        jumbotronContent.style.display = 'none';
        input.style.display = 'block';
        button.innerText('Next')
    }

}


