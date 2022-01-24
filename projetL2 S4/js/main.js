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

}

$(document).ready(function () {

    afficheListePerso();

});



function eliminer() {
    var x = document.getElementById('question').value;
    if ()
}