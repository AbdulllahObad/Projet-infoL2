//const { default: swal } = require("sweetalert");

const socket = io(); //https://stackoverflow.com/questions/44628363/socket-io-access-control-allow-origin-error 'http://localhost:3000', { transports : ['websocket'] }


const player={
    Host: false,
    RoomId:null,
    UserName:"",
    SocketID:"",
    turn:false,
    Win:false,
    lose:false
};

const userNameinput=document.getElementById('username');
const userCard = document.getElementById('user-card');
const waitingArea = document.getElementById('waiting-area');
const roomsCard=document.getElementById('rooms-card'); 
const roomsList=document.getElementById('rooms-list');
const gameArea=document.getElementById('game-card');
const TrunMessage=document.getElementById('turn-message');
const RoomsErea=document.getElementById('rooms-erea');
const backgroundimg=document.getElementById('img');
const Wrapper=document.getElementsByClassName('Wrapper');




socket.emit('getRooms'); //send a request to the server to get the avalebels rooms
socket.on('listRooms', (Rooms)=>{
    let html="";
    if (Rooms.length>0){
        Rooms.forEach(Room => {
            if(Room.players.length!=2){
                html += `<li class="list-group-item d-flex justify-content-between">
                            <p class="p-0 m-0 flex-grow-1 fw-bold"  style="color: black;">Salon de ${Room.players[0].UserName} - ${Room.id}</p>
                            <button class="btn btn-sm btn-success join-room" data-room="${Room.id}"  style="color: black;">Rejoindre</button>
                        </li>`;
            }
            if(html != ""){
                roomsCard.classList.remove('d-none');
                roomsList.innerHTML=html;
                console.log("hii",Room.id);
                for(const element of document.getElementsByClassName('join-room')){ //for every rejoindre
                    element.addEventListener('click', joinroom, false);
                }

            }
            
        });
    }
})

$("#form").on('submit', function (e){ 
  e.preventDefault();                  //The preventDefault() method cancels the event if it is cancelable
  player.UserName= userNameinput.value;
  player.Host=true;
  player.turn=true;
  player.SocketID=socket.id;
  console.log(player);  
  userCard.hidden = true;
  waitingArea.classList.remove('d-none');     
  
  socket.emit('PlayerData',player); 

});


 console.log("host",player.RoomId);  

const joinroom=function(){
    if(userNameinput !=""){
        player.UserName=userNameinput.value;
        player.SocketID=socket.id;
        player.RoomId=this.dataset.room;
        console.log("dataset",this.dataset.room);
        console.log("dataset player",player.RoomId); //dataset is for acces to all attributs that start with data-
        

        socket.emit('PlayerData', player)//we send the player data to the server
       
    }
}

socket.on('start game', (players) =>{
    swal.fire({
      title:'régles du jue:',
        html:'1)chque joueur joues à a son tour, et celui qui a crée le salon va commencer le premier<br />'+
        '2)chaque joueur a le droit poser une seule question, puis il élimine certiens personnages grâce à la répose quil a eu<br />'+
        '3)le joueur clique le button "FinTurn" pour donner le tour au autre joueur.<br />'+
        '4) le 2ème joueur va faire la même chose dans son tour.<br />'+
        '5) si un joueur élimine le personage cherché il perd, et lautre joueur gagne.<br />'+
        '6) si un joueur trouve le personage il doit choisir son prénom dans les questions, si le personage quil a choisit été la personage cherché le joueur gagne, sinon il perd<br />'+
        '7)quand le partie se termine, chaque joueur à le droit de demander une nouvelle partie, lautre joueur à le droit daccepter ou ignorer la demande.<br />'+
       ' 8) pour chaque partie, le serveur choisit un nouveau personage, et cest le même personage pour les deux joueur.<br />',
    
    })
    console.log("hi22 Ali");
    startGame(players);

});

let ennemyName="";

function startGame(players){

    document.getElementById("boutonTriche").disabled = true;
    
    
   const ennemy=players.find(r=>r.SocketID != player.SocketID); //in the table find the player with this condition
    ennemyName=ennemy.UserName;
     //window.location.replace("index.html");
     RoomsErea.classList.add('d-none');
    // Wrapper.namedItem.style.color= "#c0beb8";
     gameArea.classList.remove('d-none');

     if(player.Host & player.turn){
        SetTrunMessage( 'alert-info', 'alert-success', "C'est ton tour de jouer");
     }
     else{
         SetTrunMessage('alert-success', 'alert-info', `C'est au tour de <b>${ennemyName}</b> de jouer`);
     }
     
     if(!player.turn){
        document.getElementById("valider").disabled = true;
        document.getElementById("FinTurn").disabled = true;
       // $('img').off('click');
    }

}
function SetTrunMessage(classToRemove, classToAdd,html){
 TrunMessage.classList.remove(classToRemove);
 TrunMessage.classList.add(classToAdd);
 TrunMessage.innerHTML=html;

}

socket.on('StartPlay', (ennemy)=>{



    console.log("my turn", player.turn);
    console.log("im all",ennemy.SocketID,player.SocketID,!ennemy.turn);
    if(ennemy.SocketID != player.SocketID && player.turn){
        console.log("im if");
        document.getElementById("valider").disabled = true;
        document.getElementById("FinTurn").disabled = true;
        document.getElementById("img").disabled = true;

        SetTrunMessage('alert-success', 'alert-info', `C'est au tour de <b>${ennemy.UserName}</b> de jouer`)
        player.turn = false; }
    else {
        console.log("im else");

        document.getElementById("valider").disabled = false;
        document.getElementById("FinTurn").disabled = false;
        document.getElementById("img").disabled = false;
        SetTrunMessage('alert-info', 'alert-success', "C'est ton tour de jouer");
        player.turn = true;
        
    }
     });


socket.on('YouWin',(winner)=>{
    console.log("im win")
    swal.fire({
        title: 'Bravo!',
        text: 'vous avez bien choisi la bonne réponse.',
        imageUrl: 'https://as2.ftcdn.net/v2/jpg/03/08/90/97/1000_F_308909732_S3sJyD6r37bwpgGIfaNre2TpLtKpK57c.jpg',
        imageWidth: 400,
        imageHeight: 200,
        imageAlt: 'Custom image',
        showCancelButton: true,
        cancelButtonColor: '#d33',
        confirmButtonText:'nouvelle partie',
      }).then((result) => {
        if (result.isConfirmed) {
            console.log("winner me",winner.SocketID);
            socket.emit('AskDeRejouer', winner.SocketID);}
        });
 });
      socket.on('YouWin2',(winner)=>{
        console.log("im win")
        swal.fire({
            title: 'Bravo!',
            text: `${player.UserName} a choisi la mauvaise réponse!`,
            imageUrl: 'https://as2.ftcdn.net/v2/jpg/03/08/90/97/1000_F_308909732_S3sJyD6r37bwpgGIfaNre2TpLtKpK57c.jpg',
            imageWidth: 400,
            imageHeight: 200,
            imageAlt: 'Custom image',
            showCancelButton: true,
            cancelButtonColor: '#d33',
            confirmButtonText:'nouvelle partie',
          }).then((result) => {
            
            if (result.isConfirmed) {
                console.log("winner me",player.SocketID);
                socket.emit('AskDeRejouer', player.SocketID);
            }
            });
    

   });
socket.on('YouLose', (loser)=>{
    swal.fire({
        title: 'Vous Avez Perdu!',
        text: `${loser.UserName} a trouvé la reponse avant toi!`,
        imageUrl: 'https://cdn130.picsart.com/298264718335201.png?to=crop&type=webp&r=-1x-1&q=95',
        imageWidth: 400,
        imageHeight: 200,
        imageAlt: 'Custom image',
        showCancelButton: true,
        cancelButtonColor: '#d33',
        confirmButtonText:'nouvelle partie',
      }).then((result) => {
        if (result.isConfirmed) {
            console.log("loser me",player.SocketID);
            socket.emit('AskDeRejouer', player.SocketID);
        }
        });

});
socket.on('YouLose2', (loser)=>{
    swal.fire({
        title: 'Vous Avez Perdu!',
        text: "vous avez choisi la mauvaise réponse!",
        imageUrl: 'https://cdn130.picsart.com/298264718335201.png?to=crop&type=webp&r=-1x-1&q=95',
        imageWidth: 400,
        imageHeight: 200,
        imageAlt: 'Custom image',
        showCancelButton: true,
        cancelButtonColor: '#d33',
        confirmButtonText:'nouvelle partie',
      }).then((result) => {
        if (result.isConfirmed) {
            console.log("loser me",loser.SocketID);
            socket.emit('AskDeRejouer', loser.SocketID);
        }
        });
       

});

socket.on('ask to playAgain', (ennemy)=>{
    swal.fire({
        title: "Rejouer?",
        text:`le jouer ${ennemy.UserName} vous demande une nouvelle partie!`,
        confirmButtonText:'nouvelle partie',
        icon:'question',

    }).then((result) => {
        console.log("nouvelle partie");
        if (result.isConfirmed) {
            socket.emit('Rejouer', player.SocketID);
        }
        });

});




socket.on('rejouer', (players)=>{
    console.log("im rejouer");


    player.Win=false;
    player.lose=false;

    players.forEach(r=>{
        console.log("playesrrf",r);
        if(!r.Host){
           r.turn=false;
           socket.emit('StartPlay', r);
        
        }
        else{
            r.turn=true;
            socket.emit('StartPlay', r);
        }
    })


});
socket.on('waitingNewGame', (ennemy)=>{
    console.log("waiting...");
swal.fire({
    title:'Waiting',
    text:`en attendant que ${ennemy.UserName} accepte de rejouer...`,
    icon:'info',
    showCancelButton: false,
    showConfirmButton: false

})
});
socket.on('readyToPlay',()=>{
console.log("ready to play");
swal.fire({
    title:'Parfait!',
    text:'La nouvelle partie commence maintenant',
    icon:'success'

})
});

socket.on('disconnected',()=>{
swal.fire({
    title:"Tu joues seul!",
    text:"l'autre joueur a quitté le jeur!",
    icon:'warning',
})
});


var personnage_choisi;
socket.on('Personnage',(n)=>{
    console.log("i'm new person",n);
    personnage_choisi=n;
 console.log("client cide", personnage_choisi);});
console.log("player turn", player.turn);



console.log("host",player.RoomId);


/********************************************************************************************** */

var path_json = "js/jeu1.json";

function indexPersonnage(data) {

    var nombre_personnages = nombrePersonnages(data);

    return Math.floor((Math.random() * nombre_personnages));

}

function ResetCroix(data) {
    console.log("im croix");
    var Parcourire_photo = $("img");

    for (var i = 1; i <= 18; i++)

     Parcourire_photo[i].src = data["images"] + data["possibilites"][i - 1]["fichier"];
}





function change(clicked_id,reponse_Ordi,data) {
   

    var image = document.getElementById(clicked_id);
    image.setAttribute("class", "elimine");
    image.src = data["images"] + clicked_id + "X.png";
    var answer = reponse_Ordi;

    if (answer == clicked_id) {
        GameLost(answer);
    }
    // else {
    //     document.getElementById('correct').play();

    // }
}


function nombrePersonnages(data) {

    return data["ligne"] * data["colonne"];

}

//function personnageChoisi(data) {

   // return data["possibilites"][indexPersonnage(data)];

//}

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
function ajouteQuestion(data, mode_triche_active,count_questions) {

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

function comptePersonnage(data, reponse, caracteristique,personnage_choisi) {

    var compteur = 0;
    var nombre_personnages = nombrePersonnages(data);

    for (var i = 0; i < nombre_personnages; i++) {

        let id_nom = '#'+data["possibilites"][i]["prenom"];
        let class_perso = $(id_nom).attr("class");
        if(personnage_choisi[caracteristique]==reponse){

            if (data["possibilites"][i][caracteristique] != reponse && class_perso!="elimine") {

                compteur++;
    
            }

        }else if (data["possibilites"][i][caracteristique] == reponse && class_perso!="elimine") {

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

                $("#" + data["possibilites"][i]["prenom"]).attr({"src":data["images"] + data["possibilites"][i]["prenom"] + "X.png","class":"elimine"});
            }

        }

    } else {

        for (var i = 0; i < nombre_personnages; i++) {

            if (data["possibilites"][i][caracteristique] == reponse) {

                $("#" + data["possibilites"][i]["prenom"]).attr({"src":data["images"] + data["possibilites"][i]["prenom"] + "X.png","class":"elimine"});
            }

        }

    }

}

function afficheNombrePersoElimine(data, reponse, caracteristique,personnage_choisi) {

    var nombre = comptePersonnage(data, reponse, caracteristique,personnage_choisi);

    var personnage_dispo = nombrePersonnages(data) - personnageElimine();

    $("#nombreTriche").empty();
    $("#nombreTriche").append("Personnage éliminé : " + nombre + " / " + personnage_dispo);

}

 function GameLost(answer) {
     player.lose=true;
     console.log("im lost");
     socket.emit('lose', player);
//     document.getElementById('AffichReponse').innerHTML = 'La Bonne Réponse Était: ' + answer;
//     document.getElementById('BonReponse').innerHTML = "Vous Avez Perdu !! ";
//     document.getElementById('wrong').play();
   }

 function GameWin() {
     player.Win=true;
    socket.emit('win', player);
//     document.getElementById('AffichReponse').innerHTML = 'vous avez bien choisi la bonne réponse: ';
//     document.getElementById('BonReponse').innerHTML = "Bravo !!!";
//     document.getElementById('win').play();
 }

$(document).ready(function () {

    $.getJSON(path_json, function (data) {
        
        socket.on('croix',()=>{//enlever les croix
            console.log("croix im")
            ResetCroix(data);
        }); 

        var mode_triche_active = false;

        var count_questions = 1;

        question(data, "#question1");

        selection("#question1", "#reponse1");

        var lignes = data["ligne"];
        var colonnes = data["colonne"];

        var all_characters = $('.toutesPersonnages');

        console.log("hii",personnage_choisi);
      
        for (let i = 0; i < lignes; i++) {

            var div = $("<div></div>");
            var ligne = (div).attr('class', 'ligne'); 

            for (let j = i + ((colonnes - 1) * i); (j - i - ((colonnes - 1) * i)) < colonnes; j++) {

                var path_image = data["images"] + data["possibilites"][j]["fichier"];

                ligne.append($("<img>").attr({ 'src': path_image, 'id': data['possibilites'][j]['prenom'],'class':'coche' }).css({"height":"22.5%","width":"15%"}));

            }

            all_characters.append(ligne);

        }

        $('#boutonTriche').click(function () {

            if (!mode_triche_active) {

                mode_triche_active = true;
                $('#texteTriche').empty();
                $('#texteTriche').css("color","green");
                $('#texteTriche').append('Mode triche : activé');

            } else {

                mode_triche_active = false;
                $('#texteTriche').empty();
                $('#texteTriche').css("color","#dc3545");
                $('#texteTriche').append('Mode triche : désactivé');

            }

        });

        
        $('img').click(function (image) {
            console.log(player.turn);

            if(player.turn){
            change(this.id, personnage_choisi["prenom"],data);
            }
            
        });

       
        $("#ajouter1").click(function () {
            
            count_questions =  ajouteQuestion(data, mode_triche_active,count_questions);
            selection("#question" + count_questions, "#reponse" + count_questions);
            
        });

        $("#enlever").click(function () {

            count_questions = enleveQuestion(count_questions);

        });

       
        $("#valider").click(function () {
            document.getElementById("valider").disabled = true; //une seule question à poser chaque tour!
        
            var tableau_questions = tableauQuestion(count_questions);
            var tableau_connecteurs = tableauConnecteur(count_questions)

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

                afficheNombrePersoElimine(data, $("#reponse" + count_questions + " :selected").text(), $("#question" + count_questions + " :selected").text(),personnage_choisi);

            }

        });
        console.log(player.SocketID);

        $("#FinTurn").click(function () {


            console.log("hi Aloosh");
            socket.emit('StartPlay', player);
            console.log("turn",player.turn);
        });

    });

});




//}); //personnage_choisi
/************************************************************************************************************** */
