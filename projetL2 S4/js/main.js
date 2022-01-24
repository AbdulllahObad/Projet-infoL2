function afficheListePerso() {

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

<<<<<<< HEAD
});





/*********************************************************************************/
//Ali select tag



/*function select( ){ //for the select part
    $.getJSON("js/jeu1.json", function(data){
        let n=1;

        for(let i of data["possibilites"]){ 
            for(let j in data["possibilites"][i]){ 

            $(#list1).append("<option value="+n+">"+j+"</option> <br>");
            n++;}}


        });


}*/

/*function selection(liste){ //for the potion part

    console.log(liste.options[liste.options.selectedIndex].value);

    /*if(liste.options[liste.options.selectedIndex].value == "2"){
        $("#list2").append("<option value='6'>Homme</option> <option value='7'> Femme</option>");
    }



    


}*/
=======
}

$(document).ready(function () {

    afficheListePerso();

});



function eliminer() {
    var x = document.getElementById('question').value;
    console.log(x);
}
>>>>>>> ed83dc7cd55a3458a5ae1f1db2c59b2003c38714
