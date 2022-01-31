function indexPersonnage(data) {

    var nombre_personnages = nombrePersonnages(data);

    return Math.floor((Math.random() * nombre_personnages) + 1);

}

function nombrePersonnages(data) {

    return data["ligne"] * data["colonne"];

}

function personnageChoisi(data) {

    return data["possibilites"][indexPersonnage(data)];

}

function compareCaracteristique(personnage_choisi, caracteristique, reponse) {

    if (personnage_choisi[caracteristique] == reponse) {

        return true;

    } else {

        return false;

    }

}

$(document).ready(function () {

    $.getJSON("js/jeu1.json", function (data) {
        
        question();

        var lignes = data["ligne"];
        var colonnes = data["colonne"];

        var all_characters = $('.toutesPersonnages');

        var personnage_choisi = personnageChoisi(data);

        console.log(personnage_choisi);

        for (let i = 0; i < lignes; i++) {

            var div = $("<div></div>");
            var ligne = (div).attr('class', 'ligne');

            for (let j = i + ((colonnes - 1) * i); (j - i - ((colonnes - 1) * i)) < colonnes; j++) {

                console.log(j);

                var path_image = 'images/' + data["possibilites"][j]["fichier"];

                ligne.append($("<img>").attr({ 'src': path_image, 'height': '150', 'width': "100", 'id': data['possibilites'][j]['prenom'] }));

            }

            all_characters.append(ligne);

        }

        $("#valider").click(function () {

            console.log($("#reponse :selected").text());
            console.log($("#question :selected").text());

            if (compareCaracteristique(personnage_choisi, $("#question :selected").text(), $("#reponse :selected").text())) {

                $("#affichageReponse").empty();

                $("#affichageReponse").append("OUI");

            } else {

                $("#affichageReponse").empty();

                $("#affichageReponse").append("NON");

            }



        });

        $('img').click(function (image) {

            change(this.id);

        });

    });


});






/*********************************************************************************/
//Ali select tag



$(document).ready(function () { //for the select part
    $.getJSON("js/jeu1.json", function (data) {


        $.each(data["possibilites"][0], function (i, o) {
            // console.log(i);
            if (i != "fichier") {
                $("#question").append("<option value=" + i + ">" + i + "</option> <br>");
            }

        });

    });


});


/******************************************************************************************************** */
function selection() { //for the potion part
    document.getElementById("reponse").options.length = 0;

    $.getJSON("js/jeu1.json", function (data) {
        var liste = document.getElementById('question');

        var value = liste.options[liste.selectedIndex].value;

        var table = [];


        $.each(data["possibilites"], function (i, o) {

            for (let i in o) {
                if (i == value) {
                    if (!table.includes(o[i])) {
                        table.push(o[i]);
                    }

                }
            }




        });



        for (let i of table) {
            $("#reponse").append("<option value=" + i + ">" + i + "</option> ");

        }
    });
}






/************************************************************************************************************** */





function eliminer() {
    var x = document.getElementById('question').value;
    console.log(x);
}


function change(clicked_id) {
    var image = document.getElementById(clicked_id);
    image.src = 'images/' + clicked_id + "X.png";




    // if (image_tracker == 1) {
    //     console.log("HI");
    //     // image.src = clicked_id + '.png';
    //     image_tracker = 0;

    // } else {
    //     console.log("hello");
    //     // image.src = clicked_id + 'X.png';
    //     image_tracker = 1;
    // }




}

