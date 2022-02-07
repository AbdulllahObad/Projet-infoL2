function indexPersonnage(data){

    var nombre_personnages = nombrePersonnages(data);

    return Math.floor((Math.random() * nombre_personnages) + 1);

}

function nombrePersonnages(data){

    return data["ligne"]*data["colonne"];

}

function personnageChoisi(data){

    return data["possibilites"][indexPersonnage(data)];

}

function compareCaracteristique(personnage_choisi,caracteristique,reponse){

    if(personnage_choisi[caracteristique]==reponse){

        return true;

    }else{

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

            for (let j = i + ((colonnes-1) * i); (j - i - ((colonnes-1) * i)) < colonnes; j++) {

                console.log(j);

                var path_image = 'images/' + data["possibilites"][j]["fichier"];

                ligne.append($("<img>").attr({'src' : path_image,'height':'150','width':"100",'id':data['possibilites'][j]['prenom']}));

            }

            all_characters.append(ligne);

        }

        $("#valider").click(function(){

            console.log($("#reponse"+compteur+" :selected").text());
            console.log($("#question"+compteur+" :selected").text());

            if(compareCaracteristique(personnage_choisi,$("#question"+compteur+" :selected").text(),$("#reponse"+compteur+" :selected").text())){

                $("#affichageReponse").empty();

                $("#affichageReponse").append("OUI");

            }else{

                $("#affichageReponse").empty();

                $("#affichageReponse").append("NON");

            } 

        });


    });
   
    
});






/*********************************************************************************/
//Ali select tag

var compteur=1;

function question() { //for the select part
    $.getJSON("js/jeu1.json", function (data) {


        $.each(data["possibilites"][0], function (i, o) {
            // console.log(i);
            if (i != "fichier") {
                $("#question"+compteur).append("<option value=" + i + ">" + i + "</option> <br>");
            }

        });

    });}





 

/******************************************************************************************************** */

function selection(){ //for the potion part
    document.getElementById("reponse"+compteur).options.length = 0; 

    $.getJSON("js/jeu1.json", function(data){
  var liste= document.getElementById("question"+compteur);
    
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

     for(let i of table){
     $("#reponse"+compteur).append("<option value="+i+">"+i+"</option> ");

                        }
                    });
                }

/************************************************************************************************************** */



function ajouter(){ 
    compteur++;
    var x = document.getElementById("question1").innerHTML;
    var y = document.getElementById("reponse1").innerHTML;
    var html="<select id="+compteur+"><option>and</option><option>or</option></select> ";
    html+=" <span id='span'>Question</span><select id='question"+compteur+"' name='question' onclick='selection()'  >";
    html+=x+"</select>";
    html+=" <span id='span'>Question</span><select id='reponse"+compteur+"' name='reponse'  >";
    html+=y+"</select>";
    
    document.getElementById("ajouter").innerHTML+=html;
    console.log(html);



 for(let i=1; i<compteur;i++){
    $("#question"+i).hide();
    $("#reponse1"+i).hide();

    var id= document.getElementById("question"+i);
    var n=id.options[id.selectedIndex].value;
    document.getElementById("span").innerHTML+= "<span> :    "+n+"</span>";

    var id2= document.getElementById("reponse"+i);
    var n2=id2.options[id2.selectedIndex].value;
    document.getElementById("span2").innerHTML+= "<span> : "+n2+"</span>";

    if(i!=1){
        $("#"+i).hide();
        document.getElementById("span2").innerHTML+= "<span> : "+n2+"</span>";

        var id3= document.getElementById(i);
         var n3=id3.options[id3.selectedIndex].value;

    }
 }

    


    }

    function enlver(){
    
     var x= document.getElementById(compteur);
       x.remove();
       var y= document.getElementById("question"+compteur);
       y.remove();
       var z= document.getElementById("reponse"+compteur);
       z.remove();
    compteur--;

    }

    
/************************************************************************ */
//abdu
// Pour faire le X
function change(clicked_id, repose_Ordi) {
    var image = document.getElementById(clicked_id);
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
    document.getElementById('AffichReponse').innerHTML = 'The answer was: ' + answer;
    document.getElementById('BonReponse').innerHTML = "You Lost!!!";
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

/***************************************************************************************** */