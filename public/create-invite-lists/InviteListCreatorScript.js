function loadScripts() {

    var button = document.getElementById('button');
    button.addEventListener('click', function () {
        buttonPressed();
    })

    var jumbotronContent = document.getElementById('jumbotronContent')

    var input = document.getElementById('input');

    var question = 0;

    function createID() {
        var newID = Math.random().toString(36).substr(2, 9);
        return newID;
    }

    function buttonPressed(){

        if (question == 0){
            jumbotronContent.innerText = "Which group is this invite list for?";
            input.style.display = 'block';
            button.innerText = 'Next'
            question++;
        } else if (question == 1){
            jumbotronContent.innerText = "Dick?";
            question++
        } else if (question ==2){
            jumbotronContent.innerText = "Jaj?";
        }


    }

}


