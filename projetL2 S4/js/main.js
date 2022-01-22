$(document).ready(function(){

    $.getJSON("js/jeu1.json",function(data){

        var nombres_lignes = data["ligne"];
        var nombres_colonnes = data["colonne"];

        for (var elements in data["possibilites"]) {

            console.log(elements["0"]["prenom"]);

            /*for(let i = 0;i<nombres_lignes;i++){

                for(let j = 0;j<nombres_colonnes;j++){

                    console.log(elements);

                }

            }*/

        }

    });

});





/*********************************************************************************/
//Ali select tag



/*function select(){ //for the select part
    $.getjson(jeu1.json, function(data){
        let n=1;

        $.each(data, function(i, o){
        for(let i of data["possibilites"]){ 
            for(let j in data["possibilites"][i]){ 

            $(#list1).append("<option value='n'>j</option> <br>");
            n++;}}
        }

    });
}

function selection(liste){ //for the potion part

    console.log(liste.options[liste.options.selectedIndex].value);

    /*if(liste.options[liste.options.selectedIndex].value == "2"){
        $("#list2").append("<option value='6'>Homme</option> <option value='7'> Femme</option>");
    }



    


}*/