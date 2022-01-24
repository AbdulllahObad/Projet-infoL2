$(document).ready(function () {

    $.getJSON("js/jeu1.json", function (data) {

        var lignes = data["ligne"];
        var colonnes = data["colonne"];

        var all_characters = $('.toutesPersonnages');

        for (let i = 0; i < lignes; i++) {

            var div = $("<div></div>");
            var ligne = (div).attr('class', 'ligne');

            for (let j = i + (5 * i); (j - i - (5 * i)) < colonnes; j++) {

                var path_image = 'images/' + data["possibilites"][j]["fichier"];

                ligne.append($("<img>").attr('src', path_image));

            }

            all_characters.append(ligne);

        }

    });
});







/*********************************************************************************/
//Ali select tag



$(document).ready(function () { //for the select part
    $.getJSON("js/jeu1.json", function(data){
        
      
      $.each( data["possibilites"][0],function(i,o){
       // console.log(i);
        if(i!= "fichier"){ 
        $("#list1").append("<option value="+i+">"+i+"</option> <br>");
        }

      });

        });


});

function selection(){ //for the potion part



    document.getElementById("list2").options.length = 0;

    $.getJSON("js/jeu1.json", function(data){
  var liste= document.getElementById('list1');
    
var value = liste.options[liste.selectedIndex].value;
    
var table=[];


$.each(data["possibilites"], function(i,o){

    for(let i in o){
        if(i==value){
            if(!table.includes(o[i])){
               table.push(o[i]);
        }
       
    }}
    
    
    

});


console.log(table);
for(let i of table){
        $("#list2").append("<option value="+i+">"+i+"</option> ");

    }


});

}





function eliminer() {
    var x = document.getElementById('question').value;
    console.log(x);
}
