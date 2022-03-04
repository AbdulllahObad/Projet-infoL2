function indexPersonnage(data) {

    var nombre_personnages = nombrePersonnages(data);

    return Math.floor((Math.random() * nombre_personnages) + 1);

}

function change(clicked_id, reponse_Ordi) {

    var image = document.getElementById(clicked_id);
    image.setAttribute("class", "elimine");
    image.src = 'images/' + clicked_id + "X.png";
    var answer = reponse_Ordi;
    console.log(answer);
    console.log(clicked_id);

    if (answer == clicked_id) {
        GameLost(answer);
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

function tableauQuestion(nombre_questions) {

    var tableau_questions = [];

    for (var i = 1; i <= nombre_questions; i++) {

        var question_reponse_tab = [];

        question_reponse_tab.push($("#question" + i + " :selected").text());
        question_reponse_tab.push($("#reponse" + i + " :selected").text());

        tableau_questions.push(question_reponse_tab);

    }

    return tableau_questions;

}

function tableauConnecteur(nombre_questions) {

    var tab_connecteurs = [];

    for (var i = 2; i <= nombre_questions; i++) {

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

        $.getJSON("js/jeu1.json", function (data) {

            //var liste= document.getElementById('question');

            var value = $(id_question + " :selected").text();
            console.log(value);

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
var count = 0;
function ajouteQuestion(nombre_questions, data, mode_triche_active) {

    //var nombre_nouvelle_question = nombre_questions+1;
    //nombre_questions++;
    count++;
    if (!mode_triche_active && count < 4) {
        var div = $("<div></div>").attr("class", "question" + nombre_questions);

        var select_connecteur = $("<select></select>").attr('id', 'connecteur' + nombre_questions);

        select_connecteur.append("<option>et</option>");
        select_connecteur.append("<option>ou</option>");

        div.append(select_connecteur);

        div.append("<span>Question : </span>");

        var select = $("<select></select>").attr('id', 'question' + nombre_questions);

        question(data, select);

        div.append(select);

        div.append("<span>Reponse : </span>");

        div.append($("<select></select>").attr('id', 'reponse' + nombre_questions));

        $('.listeQuestion').append(div);

    }

}

function enleveQuestion(nombre_questions) {

    if (nombre_questions != 1) {

        var class_derniere_question = ".question" + nombre_questions;
        $(class_derniere_question).remove();

    }

}

function personnageElimine() {

    return $(".elimine").length;

}

function comptePersonnage(data, reponse, caracteristique) {

    var compteur = 0;
    var nombre_personnages = nombrePersonnages(data);

    for (var i = 0; i < nombre_personnages; i++) {

        if (data["possibilites"][i][caracteristique] != reponse) {

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

                console.log("#" + data["possibilites"][i]["prenom"]);
                $("#" + data["possibilites"][i]["prenom"]).attr("src", "images/" + data["possibilites"][i]["prenom"] + "X.png");
            }

        }

    } else {

        for (var i = 0; i < nombre_personnages; i++) {

            if (data["possibilites"][i][caracteristique] == reponse) {

                console.log("#" + data["possibilites"][i]["prenom"]);
                $("#" + data["possibilites"][i]["prenom"]).attr("src", "images/" + data["possibilites"][i]["prenom"] + "X.png");
            }

        }

    }

}

function afficheNombrePersoElimine(data, reponse, caracteristique) {

    var nombre = comptePersonnage(data, reponse, caracteristique);

    var personnage_dispo = nombrePersonnages(data) - personnageElimine();

    $("#nombreTriche").empty();
    $("#nombreTriche").append("Personnage éliminé : " + nombre + " / " + personnage_dispo);

}

function GameLost(answer) {
    document.getElementById('AffichReponse').innerHTML = 'La Bonne Réponse Était: ' + answer;
    document.getElementById('BonReponse').innerHTML = "Vous Avez Perdu !! ";
}

function GameWin() {
    document.getElementById('AffichReponse').innerHTML = 'vous avez bien choisi la bonne réponse: ';
    document.getElementById('BonReponse').innerHTML = "Bravo !!!";

}

$(document).ready(function () {

    $.getJSON("js/jeu1.json", function (data) {

        var mode_triche_active = false;

        var nombre_questions = 1;

        question(data, "#question1");

        selection("#question1", "#reponse1");

        console.log($('#reponse'));

        var lignes = data["ligne"];
        var colonnes = data["colonne"];

        var all_characters = $('.toutesPersonnages');

        //var personnage_choisi = personnageChoisi(data);
        var personnage_choisi = data['possibilites']['12'];
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

        $('#boutonTriche').click(function () {

            if (!mode_triche_active) {

                mode_triche_active = true;
                $('#texteTriche').empty();
                $('#texteTriche').append('Mode triche : activé');

            } else {

                mode_triche_active = false;
                $('#texteTriche').empty();
                $('#texteTriche').append('Mode triche : désactivé');

            }

        });

        $('img').click(function (image) {

            change(this.id, personnage_choisi.prenom);

        });

        $("#ajouter1").click(function () {

            nombre_questions++;
            ajouteQuestion(nombre_questions, data, mode_triche_active);

            selection("#question" + nombre_questions, "#reponse" + nombre_questions);

        });

        $("#enlever").click(function () {

            enleveQuestion(nombre_questions);
            nombre_questions--;

        });

        $("#valider").click(function () {



            /*console.log($("#reponse :selected").text());
            console.log($("#question :selected").text());

            if(mode_triche_active){
                
                cochePersonnage(data,$("#reponse"+nombre_questions+" :selected").text(),$("#question"+nombre_questions+" :selected").text());

            }else{

                if(compareCaracteristique(personnage_choisi,$("#question"+nombre_questions+" :selected").text(),$("#reponse"+nombre_questions+" :selected").text())){

                    $("#affichageReponse").empty();
    
                    $("#affichageReponse").append("OUI");
    
                }else{
    
                    $("#affichageReponse").empty();
    
                    $("#affichageReponse").append("NON");
    
                } 

            };

            tableauQuestion(nombre_questions);*/
            var tableau_questions = tableauQuestion(nombre_questions);
            var tableau_connecteurs = tableauConnecteur(nombre_questions)

            console.log(tableau_questions);

            var reponse_pc = validerPlusieursQuestions(personnage_choisi, tableau_connecteurs, tableau_questions);

            if ($("#question1 :selected").text() == "prenom" && reponse_pc != true) {

                GameLost(personnage_choisi['prenom']);

            } else if ($("#question1 :selected").text() == "prenom" && reponse_pc == true) {

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

                afficheNombrePersoElimine(data, $("#reponse" + nombre_questions + " :selected").text(), $("#question" + nombre_questions + " :selected").text());

            }

        });

    });

});

/************************************************************************************************************** */