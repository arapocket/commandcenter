function loadScripts() {


    var checkbox = document.getElementById('person');
    var checkallbox = document.getElementById('checkallbox');

    checkallbox.addEventListener('click', function(e){
        console.log('checkallbox clicked');

        checkbox.click();
        

    })

    checkbox.addEventListener('click', function(e){
        console.log('a checkbox clicked');
    })


}