function loadScripts() {


    var checkboxes = [];

    for (i = 0 ; i < results.length ; i++){
        
        let person = results[i];
        let checkbox = document.getElementById(person.EmpID);

        if (checkbox != null || checkbox != undefined){
            
            checkbox.addEventListener('click', function(e) {
                console.log('a checkbox clicked');
            })

            checkboxes.push(checkbox);
        }        
    }

    var checkallbox = document.getElementById('checkallbox');

    checkallbox.addEventListener('click', function(e){
        console.log('checkallbox clicked');    
    })

}