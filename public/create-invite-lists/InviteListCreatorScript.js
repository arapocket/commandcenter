function loadScripts() {

    var button = document.getElementById('button');
    button.addEventListener('click', function () {
        buttonPressed();
    })


    var input = document.getElementById('input');

    var question = 0;

    function createID() {
        var newID = Math.random().toString(36).substr(2, 9);
        return newID;
    }

    function buttonPressed(){

        if (question == 0){
            input.style.display = 'block';
            button.innerText = 'Next'
            question++;
        } else if (question == 1){
            question++
        } else if (question ==2){
        }


    }

}


