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