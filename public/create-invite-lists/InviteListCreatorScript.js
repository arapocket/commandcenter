function loadScripts() {

    var button = document.getElementById('button');
    button.addEventListener('click', function () {
        buttonPressed();
    })

    var backButton = document.getElementById('backButton');
    backButton.addEventListener('click', function () {
        backButtonPressed();
    })


    var groupDropdown = document.getElementById('groupDropdown');

    var header = document.getElementById('header')
    
    var comment = document.getElementById('comment')

    var question = 0;

    function createID() {
        var newID = Math.random().toString(36).substr(2, 9);
        return newID;
    }

    function backButtonPressed(){
        question--;
        checkQuestion();
    }

    function buttonPressed(){
        question++
        checkQuestion();
    }

    function checkQuestion(){
        if (question == 0){
            groupDropdown.style.display = 'block';
            backButton.style.display = 'none';
            button.innerText = 'Next'
            question++;
            comment.innerText = 'Who is this list for?'
        } else if (question == 1){
            groupDropdown.style.display = 'none';
            backButton.style.display = 'block';
            button.innerText = 'Next'
            question++;
            comment.innerText = 'You are making a list for ' + groupDropdown.value;            
        } else if (question ==2){
        }

    }

}


