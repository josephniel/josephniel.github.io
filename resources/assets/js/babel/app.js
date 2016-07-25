(function() {

    document.addEventListener("keypress", function(e){
        
        console.log("key pressed");

        var key = e.keyCode,
            body = document.getElementsByTagName("body")[0];

        if(key == 40){ // down arrow
            console.log("down: "+body.scrollTop);
        } 
        else if(key == 38){ // up arrow

        }
    });

})();