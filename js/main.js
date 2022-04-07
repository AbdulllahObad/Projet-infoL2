var path_json = "js/jeu3.json";
//l'attribut principale pour identifier les objets
var id_Personnage = "prenom";


function indexPersonnage(data) {

    var nombre_personnages = nombrePersonnages(data);

    return Math.floor((Math.random() * nombre_personnages));

}

//vérification si les objets(dans le fichier json) ont des prenoms ,
//ou juste des noms (voitures, légumes,instruments,.....etc)
function Prenom_existe(data) {

    $.each(data["possibilites"][0], function (i) {

        if (i != "Prenom") {

            id_Personnage = "nom";

        }

    });

}

function change(clicked_id, reponse_Ordi, data) {

    var image = document.getElementById(clicked_id);
    image.setAttribute("class", "elimine");
    image.src = data["images"] + clicked_id + "X.png";
    var answer = reponse_Ordi;

    if (answer == clicked_id) {
        GameLost(answer);
    }
    else {
        document.getElementById('correct').play();

    }

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

function tableauQuestion(count_questions) {

    var tableau_questions = [];

    for (var i = 1; i <= count_questions; i++) {

        var question_reponse_tab = [];

        question_reponse_tab.push($("#question" + i + " :selected").text());
        question_reponse_tab.push($("#reponse" + i + " :selected").text());

        tableau_questions.push(question_reponse_tab);

    }

    return tableau_questions;

}

function tableauConnecteur(count_questions) {

    var tab_connecteurs = [];

    for (var i = 2; i <= count_questions; i++) {

        tab_connecteurs.push($("#connecteur" + i + " :selected").text());

    }

    return tab_connecteurs;

}

function existeConnecteurOu(tableau_connecteurs) {

    var position_ou = -1;

    for (var i = 0; i < tableau_connecteurs.length; i++) {

        if (tableau_connecteurs[i] == 'ou') {

            position_ou = i;

        }

    }

    return position_ou;

}

function validerPlusieursQuestions(personnage_choisi, tableau_connecteurs, tableau_questions) {

    if (tableau_questions.length == 1) {

        return compareCaracteristique(personnage_choisi, tableau_questions[0][0], tableau_questions[0][1]);

    } else {

        var existe_ou = existeConnecteurOu(tableau_connecteurs);

        if (existe_ou != -1) {

            var tete_tableau = [];
            var connecteurs_tete = [];

            var queue_tableau = [];
            var connecteurs_queue = [];

            for (var i = 0; i <= existe_ou; i++) {

                tete_tableau.push(tableau_questions[i]);

                if (i != existe_ou) {

                    connecteurs_tete.push(tableau_connecteurs[i]);

                }

            }

            for (var i = existe_ou + 1; i < tableau_questions.length; i++) {

                queue_tableau.push(tableau_questions[i]);

                if (i != existe_ou) {

                    connecteurs_tete.push(tableau_connecteurs[i]);

                }

            }

            return validerPlusieursQuestions(personnage_choisi, connecteurs_tete, tete_tableau) || validerPlusieursQuestions(personnage_choisi, connecteurs_queue, queue_tableau);

        } else {

            var premiere_question = tableau_questions.shift();
            tableau_connecteurs.shift();

            return compareCaracteristique(personnage_choisi, premiere_question[0], premiere_question[1]) && validerPlusieursQuestions(personnage_choisi, tableau_connecteurs, tableau_questions);

        }

    }

}

//Ali

function question(data, id_select) { //for the select part

    $.each(data["possibilites"][0], function (i) {

        if (i != "fichier") {

            $(id_select).append("<option value=" + i + ">" + i + "</option> <br>");

        }

    });

}

function selection(id_question, id_reponse) { //for the potion part

    $(id_question).click(function () {


        $(id_reponse).empty();

        $.getJSON(path_json, function (data) {

            //var liste= document.getElementById('question');

            var value = $(id_question + " :selected").text();

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

                $(id_reponse).append("<option value=" + i + ">" + i + "</option> ");

            }
        });


    });

}
function ajouteQuestion(data, mode_triche_active, count_questions) {

    //var nombre_nouvelle_question = nombre_questions+1;
    //nombre_questions++;
    if (!mode_triche_active && count_questions < 4) {
        count_questions++;
        var div = $("<div></div>").attr("class", "question" + count_questions);

        var select_connecteur = $("<select></select>").attr('id', 'connecteur' + count_questions);

        select_connecteur.append("<option>et</option>");
        select_connecteur.append("<option>ou</option>");

        div.append(select_connecteur);

        div.append("<span>Question : </span>");

        var select = $("<select></select>").attr('id', 'question' + count_questions);

        question(data, select);

        div.append(select);

        div.append("<span>Reponse : </span>");

        div.append($("<select></select>").attr('id', 'reponse' + count_questions));

        $('.listeQuestion').append(div);

    }

    return count_questions;

}

function enleveQuestion(count_questions) {

    if (count_questions != 1) {

        var class_derniere_question = ".question" + count_questions;
        $(class_derniere_question).remove();
        count_questions--;

    }

    return count_questions;

}

function personnageElimine() {

    return $(".elimine").length;

}

function comptePersonnage(data, reponse, caracteristique, personnage_choisi) {

    var compteur = 0;
    var nombre_personnages = nombrePersonnages(data);

    for (var i = 0; i < nombre_personnages; i++) {

        let id_nom = '#' + data["possibilites"][i][id_Personnage];
        let class_perso = $(id_nom).attr("class");
        if (personnage_choisi[caracteristique] == reponse) {

            if (data["possibilites"][i][caracteristique] != reponse && class_perso != "elimine") {

                compteur++;

            }

        } else if (data["possibilites"][i][caracteristique] == reponse && class_perso != "elimine") {

            compteur++;

        }

    }

    return compteur;

}

function cochePersonnage(personnage_choisi, data, reponse, caracteristique) {

    var nombre_personnages = nombrePersonnages(data);

    if (compareCaracteristique(personnage_choisi, caracteristique, reponse) == true) {

        for (var i = 0; i < nombre_personnages; i++) {

            if (data["possibilites"][i][caracteristique] != reponse) {

                $("#" + data["possibilites"][i][id_Personnage]).attr({ "src": data["images"] + data["possibilites"][i][id_Personnage] + "X.png", "class": "elimine" });
            }

        }

    } else {

        for (var i = 0; i < nombre_personnages; i++) {

            if (data["possibilites"][i][caracteristique] == reponse) {

                $("#" + data["possibilites"][i][id_Personnage]).attr({ "src": data["images"] + data["possibilites"][i][id_Personnage] + "X.png", "class": "elimine" });
            }

        }

    }

}

function afficheNombrePersoElimine(data, reponse, caracteristique, personnage_choisi) {

    var nombre = comptePersonnage(data, reponse, caracteristique, personnage_choisi);

    var personnage_dispo = nombrePersonnages(data) - personnageElimine();

    $("#nombreTriche").empty();
    $("#nombreTriche").append("Personnage éliminé : " + nombre + " / " + personnage_dispo);

}

function GameLost(answer) {
    document.getElementById('AffichReponse').innerHTML = 'La Bonne Réponse Était: ' + answer;
    document.getElementById('BonReponse').innerHTML = "Vous Avez Perdu !! ";
    document.getElementById('wrong').play();
}

function GameWin() {
    document.getElementById('AffichReponse').innerHTML = 'vous avez bien choisi la bonne réponse: ';
    document.getElementById('BonReponse').innerHTML = "Bravo !!!";
    document.getElementById('win').play();

}

$(document).ready(function () {

    $.getJSON(path_json, function (data) {

        var mode_triche_active = false;

        var count_questions = 1;

        question(data, "#question1");
        // fonction de vérification,si nom ou prénom existe dans le fichier json
        Prenom_existe(data)

        selection("#question1", "#reponse1");

        var lignes = data["ligne"];
        var colonnes = data["colonne"];

        var all_characters = $('.toutesPersonnages');

        var personnage_choisi = personnageChoisi(data);

        console.log(personnage_choisi);

        for (let i = 0; i < lignes; i++) {

            var div = $("<div></div>");
            var ligne = (div).attr('class', 'ligne');

            for (let j = i + ((colonnes - 1) * i); (j - i - ((colonnes - 1) * i)) < colonnes; j++) {

                var path_image = data["images"] + data["possibilites"][j]["fichier"];

                ligne.append($("<img>").attr({ 'src': path_image, 'id': data['possibilites'][j][id_Personnage], 'class': 'coche' }).css({ "height": "22.5%", "width": "15%" }));

            }

            all_characters.append(ligne);

        }

        $('#boutonTriche').click(function () {

            if (!mode_triche_active) {

                mode_triche_active = true;
                $('#texteTriche').empty();
                $('#texteTriche').css("color", "green");
                $('#texteTriche').append('Mode triche : activé');

            } else {

                mode_triche_active = false;
                $('#texteTriche').empty();
                $('#texteTriche').css("color", "#dc3545");
                $('#texteTriche').append('Mode triche : désactivé');

            }

        });

        $('img').click(function (image) {

            change(this.id, personnage_choisi[id_Personnage], data);

        });

        $("#ajouter1").click(function () {

            count_questions = ajouteQuestion(data, mode_triche_active, count_questions);

            selection("#question" + count_questions, "#reponse" + count_questions);

        });

        $("#enlever").click(function () {

            count_questions = enleveQuestion(count_questions);

        });

        $("#valider").click(function () {

            var tableau_questions = tableauQuestion(count_questions);
            var tableau_connecteurs = tableauConnecteur(count_questions)

            var reponse_pc = validerPlusieursQuestions(personnage_choisi, tableau_connecteurs, tableau_questions);

            if ($("#question1 :selected").text() == id_Personnage && reponse_pc != true) {

                GameLost(personnage_choisi[id_Personnage]);

            } else if ($("#question1 :selected").text() == id_Personnage && reponse_pc == true) {

                GameWin();

            } else if (mode_triche_active) {

                for (let i = 0; i < tableau_questions.length; i++) {

                    cochePersonnage(personnage_choisi, data, tableau_questions[i][1], tableau_questions[i][0]);

                }

            } else if (reponse_pc) {

                $("#affichageReponse").empty();
                $("#affichageReponse").append("OUI");

            } else {

                $("#affichageReponse").empty();
                $("#affichageReponse").append("NON");

            }

        });

        $('#estimer').click(function () {

            if (mode_triche_active) {

                afficheNombrePersoElimine(data, $("#reponse" + count_questions + " :selected").text(), $("#question" + count_questions + " :selected").text(), personnage_choisi);

            }

        });

    });

});

/************************************************************************************************************** */