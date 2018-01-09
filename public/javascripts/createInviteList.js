function loadScripts() {


    var checkbox = document.getElementById('person');
    var checkallbox = document.getElementById('checkallbox');

    checkallbox.addEventListener('click', function(e){
        console.log('checkallbox clicked');

        checkbox[i].click();
        

    })

    checkbox.addEventListener('click', function(e){
        console.log('a checkbox clicked');
    })


}