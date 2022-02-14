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
    console.log(personnage_choisi);
    console.log(caracteristique);
    console.log(reponse);

    if (caracteristique == "prenom") {

        if (personnage_choisi.prenom == reponse) {
            GameWin();

        }
        else {
            GameLost(personnage_choisi.prenom);
        }
    }

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



        for (let i = 0; i < lignes; i++) {

            var div = $("<div></div>");
            var ligne = (div).attr('class', 'ligne');

            for (let j = i + ((colonnes - 1) * i); (j - i - ((colonnes - 1) * i)) < colonnes; j++) {



                var path_image = 'images/' + data["possibilites"][j]["fichier"];

                ligne.append($("<img>").attr({ 'src': path_image, 'height': '150', 'width': "100", 'id': data['possibilites'][j]['prenom'] }));

            }

            all_characters.append(ligne);

        }

        $("#valider").click(function () {

            if (compareCaracteristique(personnage_choisi, $("#question :selected").text(), $("#reponse :selected").text())) {


                $("#affichageReponse").empty();

                $("#affichageReponse").append("OUI");

            } else {

                $("#affichageReponse").empty();

                $("#affichageReponse").append("NON");

            }


        });
        // Envoyer vers ma funchtion chanfe
        $('img').click(function (image) {

            change(this.id, personnage_choisi.prenom);

        });


    });


}); // fin






/*********************************************************************************/
//Ali select tag



function question() { //for the select part
    $.getJSON("js/jeu1.json", function (data) {


        $.each(data["possibilites"][0], function (i, o) {
            // console.log(i);
            if (i != "fichier") {
                $("#question").append("<option value=" + i + ">" + i + "</option> <br>");
            }

        });

    });
}







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



function ajouter() {
    /*var x = document.getElementById("question").innerHTML;
    var html="<br><select><potion>and</option><option>or</option></select> "    ;
    html+="<select id='question' "+onclick=selection()+">"+x+"</select>"
    var y = document.getElementById("reponse").innerHTML;
    html+="<select id='reponse' name='reponse'>"+y+"</select>";*/
    var compteur = 1;
    var x = document.getElementById("test").innerHTML;
    var html = "<br><select id='compteur'><option>and</option><option>or</option></select> ";
    html += x;
    document.getElementById("ajouter").innerHTML += html;






}
// Pour faire le X
function change(clicked_id, repose_Ordi) {
    var image = document.getElementById(clicked_id);
    image.setAttribute('class', 'elimine');
    image.src = 'images/' + clicked_id + "X.png";
    var answer = repose_Ordi;
    console.log(answer);
    console.log(clicked_id);

    if (answer == clicked_id) {
        GameLost(answer);
    }
}

// function fin partie

function GameLost(answer) {
    document.getElementById('AffichReponse').innerHTML = 'La Bonne Réponse Était: ' + answer;
    document.getElementById('BonReponse').innerHTML = "Vous Avez Perdu !! ";
}

function GameWin() {
    document.getElementById('AffichReponse').innerHTML = 'vous avez bien choisi la bonne réponse: ';
    document.getElementById('BonReponse').innerHTML = "Bravo !!!";

}



function selection2() { //for the potion part
    document.getElementById("reponse").options.length = 0;

    $.getJSON("js/jeu1.json", function (data) {
        var liste = document.getElementById('question');

        var value = liste.options[liste.selectedIndex].value;
        console.log(value);
    });
}






