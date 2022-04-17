function ajouterAttribut(nombre_attribut,element){

    nombre_attribut++;
    $(element).prepend("<div><input type='text' name='attributs[]' placeholder='attribut n°"+nombre_attribut+"'></div>");

    return nombre_attribut;

}

$(document).ready(function(){

    nombre_attribut=$(".form_attribut").find("input").length-2;

    $(window).resize(function(){
        let width = $(window).width();
        if(width<=1836 && width>=1480){
            $(".button_arg").empty();
            $(".button_arg").append("Modifier a.");
        }else{
            $(".button_arg").empty();
            $(".button_arg").append("Modifier arguments");
        }
    });

    $(".but").click(function(){
        $("#gris").css("visibility","visible");
        $(".div_attribut").css("visibility","visible");

    });
    $("#gris").click(function(){

        $("#gris").css("visibility","hidden");
        $(".div_attribut").css("visibility","hidden");
        $(".attributperso").css("visibility","hidden");

    });
    $(".ajouter").click(function(){

        nombre_attribut=ajouterAttribut(nombre_attribut,".liste_attr");

    });
    $.getJSON("temp_fichier.json",function(data){

        $(".personnage").click(function(){
            $(".attributperso").empty();
            $("#gris").css("visibility","visible");
            $(".attributperso").css("visibility","visible");
            let id_perso = parseInt($(this).attr('id'));
            let perso = data['possibilites'][id_perso];
            let form = $("<form method='post' enctype='multipart/form-data'></form>");
            for (const [key, value] of Object.entries(perso)) {
                let input;
                if(key=='fichier'){

                    input = $("<div><label for='"+key+"'>'"+key+"' :</label><input type='file' id='"+key+"'name='"+key+"' data-default-file="+value+"></div>");

                }else{

                    input = $("<div><label for='"+key+"'>'"+key+"' :</label><input type='text' id='"+key+"'name='"+key+"' value="+value+"></div>");

                }
                console.log(perso);
                form.append(input);
              }
              form.append($("<input type='hidden' name='id' value='"+id_perso+"'>"))
              form.append($("<input type='submit' name='modif_attribut'>"));
              $(".attributperso").append(form);
    
        });
    

    });

});