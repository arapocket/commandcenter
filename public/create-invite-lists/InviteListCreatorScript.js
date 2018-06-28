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

    var group = '';

    function createID() {
        var newID = Math.random().toString(36).substr(2, 9);
        return newID;
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
            comment.innerText = 'Who is this list for?'
        } else if (question == 2){
            groupDropdown.style.display = 'none';
            backButton.style.display = 'block';
            button.innerText = 'Next'
            comment.innerText = 'You are making a list for a ' + groupDropdown.value + '.';
            group = groupDropdown.value;
        } else if (question == 3){
            groupDropdown.style.display = 'block';
            $(groupDropdown).empty();
            button.innerText = 'Next'
            comment.innerText = 'Which ' + group + ' do you want to add?'    
        }

    }

}


