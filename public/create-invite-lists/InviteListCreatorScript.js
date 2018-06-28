function loadScripts() {

    var button = document.getElementById('button');
    button.addEventListener('click', function () {
        buttonPressed();
    })

    var backButton = document.getElementById('backButton');
    backButton.addEventListener('click', function () {
        backButtonPressed();
    })

    var yesButton = document.getElementById('yesButton');
    yesButton.addEventListener('click', function () {
        yesButtonPressed();
    })

    var noButton = document.getElementById('noButton');
    noButton.addEventListener('click', function () {
        noButtonPressed();
    })


    var groupDropdown = document.getElementById('groupDropdown');

    var selectionDropdown = document.getElementById('selectionDropdown');

    var header = document.getElementById('header')
    
    var comment = document.getElementById('comment')

    var question = 0;

    var group = '';

    var yesSelected = false;

    function createID() {
        var newID = Math.random().toString(36).substr(2, 9);
        return newID;
    }

    function yesButtonPressed(){
        yesSelected = true;
        checkOption();
    }

    function noButtonPressed(){
        yesSelected = false;
        checkOption();
    }

    function backButtonPressed(){
        question--;
        checkQuestion();
    }

    function buttonPressed(){
        
        if (question ==1) {
            if (groupDropdown.value == ''){
                bootbox.alert('Please select a choice from the dropdown.')
            } else {
                question ++
                checkQuestion();
            }
        } else {
            question++;
            checkQuestion();
        }
    }

    function checkQuestion(){
        if (question ==0){
            groupDropdown.style.display = 'none';
            backButton.style.display = 'none'

            button.innerText = 'Begin'
            comment.innerText = 'You can follow this wizard to quickly create an invite list.'
        } 
        else if (question == 1){
            groupDropdown.style.display = 'block';
            backButton.style.display = 'block';

            button.innerText = 'Next'
            comment.innerText = 'What do you want to add to the list?'
        } else if (question == 2){
            groupDropdown.style.display = 'none';
            selectionDropdown.style.display = 'none';
            backButton.style.display = 'block';
            button.style.display = 'block';
            noButton.style.display = 'none'
            yesButton.style.display = 'none'

            button.innerText = 'Next'
            comment.innerText = 'You are making a list for a ' + groupDropdown.value + '.';
            group = groupDropdown.value;
        } else if (question == 3){
            backButton.style.display = 'block'
            button.style.display = 'block';
            selectionDropdown.style.display = 'block';
            noButton.style.display = 'none'
            yesButton.style.display = 'none'

            comment.innerText = 'Which ' + group + ' do you want to add?'
        } else if (question == 4){
            backButton.style.display = 'none'
            button.style.display = 'none';
            selectionDropdown.style.display = 'none';
            noButton.style.display = 'block'
            yesButton.style.display = 'block'

            comment.innerText = 'Do you want to add any other groups?'
        } else if (question == 5){
            noButton.style.display = 'none'
            yesButton.style.display = 'none'
            
            comment.innerText = 'Titties';
        }
    }

    function checkOption(){

        console.log(question);

        if (question == 4) {
            if (yesSelected) {
                question == 2;
                checkQuestion();
            } else {
                question++;
                checkQuestion();
            }
        }
    }

}


