<?php
session_start();
header('Pragma: no-cache');
header('Expires: 0');
header('Last-Modified: ' . gmdate('D, d M Y H:i:s') . ' GMT');
header('Cache-Control: no-cache, must-revalidate');
if(!isset($_SESSION['json'])){
   $_SESSION['json']=[];
}
if(!empty($_SESSION['json']['colonne']) && !empty($_SESSION['json']['ligne'])){
   $taille_tab = intval($_SESSION['json']['colonne']) * intval($_SESSION['json']['ligne']);
}
$zip = new ZipArchive();
$filename = "./json_zip.zip";

if ($zip->open($filename, ZipArchive::CREATE)!==TRUE) {
    echo ("Impossible d'ouvrir le fichier <$filename>\n");
}
$zip->addEmptyDir('images');
$zip->addFile("images/X.png","images/X.png");
?>
<?php 
      function compareperso($perso1,$perso2){
         $identique=true;
         foreach ($perso1 as $key => $val) {
            foreach ($perso2 as $key1 => $val2) {
               if($key!='fichier'){
                  if($perso1[$key]!=$perso2[$key])
                     $identique=false;
               }
            }
         }
         return $identique;
      }
      if (!empty($_POST["telecharger"])){
         $images_equals=false;
         $personnes_equals=false;
         for($i=0;$i<$taille_tab;$i++){
            for($j=0;$j<$taille_tab;$j++){
               if(($_SESSION['json']['possibilites'][$i]['fichier']==$_SESSION['json']['possibilites'][$j]['fichier'] )&& $i!=$j){
                  $images_equals=true;
               }
            }
         }
         for($i=0;$i<$taille_tab;$i++){
            for($j=0;$j<$taille_tab;$j++){
               if(compareperso($_SESSION['json']['possibilites'][$i],$_SESSION['json']['possibilites'][$j]) && $i!=$j){
                  $personnes_equals=true;
               }
            }
         }
         if((!isset($_SESSION['json']['possibilites']['0']['nom']) && !isset($_SESSION['json']['possibilites']['0']['prenom']))){
            $alert = "Attention il faut obligatoirement au moins un attribut nom ou prenom !";
         }
         else if(!$images_equals && !$personnes_equals){
            $zip->addFile("temp_fichier.json","personnages.json");
            header("Location: telechargement.php");
         }else{
            $alert = "Certains personnages ne peuvent être distinguer par leurs attributs ou leurs photos !";
         }
       } 
       
       if (!empty($_POST['modif_attribut'])) {
         $perso_current = $_SESSION['json']["possibilites"][$_POST['id']];
         foreach ($perso_current as $key => $val) {
             if ($key == 'fichier' && !empty($_FILES['fichier']['name'])) {         
                 $errors= array();
                 $file_name = $_FILES['fichier']['name'];
                 $file_size =$_FILES['fichier']['size'];
                 $file_tmp =$_FILES['fichier']['tmp_name'];
                 $file_type=$_FILES['fichier']['type'];
                 $file_ext=explode('.',$_FILES['fichier']['name']);
                 $file_ext=strtolower(end($file_ext));
                 
                 $extensions= array("jpeg","jpg","png");
                 
                 if(in_array($file_ext,$extensions)=== false){
                    $errors[]="extension pas permise";
                 }
                                     
                 if(empty($errors)==true){
                    move_uploaded_file($file_tmp,"images/".$file_name);
                    $zip->addFile("images/".$file_name,"images/".$file_name);
                 }else{
                    print_r($errors);
                 }      
                 $_SESSION['json']["possibilites"][$_POST['id']]['fichier'] = $file_name;
             } elseif ($key != 'fichier') {
                 $_SESSION['json']["possibilites"][$_POST['id']][$key] = $_POST[$key];
             }
         }
         file_put_contents('temp_fichier.json', json_encode($_SESSION['json']));
     }
     if (!empty($_POST['reset'])) {
      $_SESSION['json']['colonne'] = 0;
      $_SESSION['json']['ligne'] = 0;
      $_SESSION['json']['possibilites'] = null;
      file_put_contents('temp_fichier.json',json_encode($_SESSION['json']));
  }
  if (!empty($_POST['valide_attribut']) && $_SESSION['json']['colonne'] > 0 && $_SESSION['json']['ligne'] > 0) {
      for ($i = 0; $i <$taille_tab; $i++) {
         $j=0;
          foreach($_POST['attributs'] as $key=>$val){
           $_SESSION['json']['possibilites'][strval($i)][strtolower($val)] = '';
           $j++;
        }
          }
      file_put_contents('temp_fichier.json', json_encode($_SESSION['json']));

  }
  if (!empty($_POST['valider'])){
   if(is_int(intval($_POST['ligne'])) && is_int(intval($_POST['colonne'])) && intval($_POST['colonne'])!=0 && intval($_POST['ligne']!=0)){
    $_SESSION['json']['images']="images/";
    $_SESSION['json']['colonne'] = $_POST['ligne'];
    $_SESSION['json']['ligne'] = $_POST['colonne'];
    $taille_colonne = $_SESSION['json']['colonne'];
    $taille_ligne = $_SESSION['json']['ligne'];
    $taille_tab = intval($taille_colonne) * intval($taille_ligne);
    for ($i = 0; $i < $taille_tab; $i++) {
        $_SESSION['json']['possibilites'][strval($i)] = ["fichier" => ""];
    }
    file_put_contents('temp_fichier.json',json_encode($_SESSION['json']));

   }
}
?>
<!DOCTYPE html>
<html>
   <head>
      <meta charset="UTF-8" />
      <title>QuiEstCe</title>
      <meta name="description" content="this is our play" />
      <link rel="stylesheet" href="css2.css">
      <link rel="stylesheet" href="style.css">
   </head>
   <body>
      <?php
      if(!empty($alert)){
         echo $alert;
         unset($alert);
      }
      ?>
      <div id="gris"></div>
      <br>
      <div class="div_attribut">
         <?php if (isset($_SESSION['json']) && $_SESSION['json']['colonne'] > 0 && $_SESSION['json']['ligne'] > 0) { ?>
         <div><button class="ajouter">Ajouter</button></div>
         <div class="div">
            <form action="" method="post" class="form_attribut">
               <div class="liste_attr">
               </div>
               <div><input type="submit" name="valide_attribut" value="Valider"></div>
            </form>
            <?php } else {echo '<div style="color:red;">Veuillez d\'abord saisir un nombre de colonnes et lignes positifs avant d\'ajouter des attributs</div>';} ?>
         </div>
      </div>
      <div class="container2">
         <div class="attributperso"></div>
         <div class="container1">
            <form action="" method="post">
               <div class="form">
                  <label for="ligne">Nombre de lignes :</label>
                  <br>
                  <input type="text" name="ligne">
               </div>
               <div class="form" class="form">
                  <label for="colonne">Nombre de colonnes :</label>
                  <br>
                  <input type="text" name="colonne">
               </div>
               <div class="val_reset">
               <input class="button" type="submit" name="valider" value="Valider grille">
               <form method="post">
                  <input class="button" type="submit" name="reset" value="Reset tableau">
               </form>
            </div>
            </form>
            
            <div class="form2">
               <button class="but button button_arg">Ajouter arguments</button>
               <form action="" method="post"><input class="button" type="submit" name="telecharger" value="Telecharger"></form>
            </div>
         </div>
         <br>
         <div class="toutesPersonnages">
            <?php
               if (!empty($_SESSION['json']['colonne']) && !empty($_SESSION['json']['ligne'])) {
                   $taille_colonne = $_SESSION['json']['colonne'];
                   $taille_ligne = $_SESSION['json']['ligne'];
                   $taille_tab = intval($taille_colonne) * intval($taille_ligne);
                   $size_div = (100/($taille_colonne*$taille_colonne))*$taille_colonne*0.4;
                   for ($i = 0; $i < $taille_ligne; $i++) { ?>
            <div class="ligne">
               <?php for ($j = 0; $j < $taille_colonne; $j++) { ?>
                  
               <div class='personnage' style=<?php echo "width:".$size_div."vw;height:".$size_div*1.2."vw;" ?> id=<?php echo $i * $taille_colonne + $j; ?> style="display:inline-flex;" ><img style="height:100%;width:100%;padding:0;" src=<?php echo "'images/" . $_SESSION['json']['possibilites'][$i * $taille_colonne + $j]['fichier'] . "'";?>onerror="this.style.display='none'"></div>
               <?php } ?>
            </div>
            <?php }
               }
               ?>
         </div>
      </div>
      <?php
         
         
         ?>
      <script type="text/javascript" src="https://ajax.googleapis.com/ajax/libs/jquery/3.1.0/jquery.min.js"></script>
      <script src="script.js"></script>
      <br>
      <div align="left" class="output">
         <div>Output : </div>
         <br>
         <?php
            $json_file = file_get_contents('temp_fichier.json',json_encode($_SESSION['json']));
            $tab_nb=0;
            for($i=0;$i<strlen($json_file);$i++){
               if($json_file[$i]=='{'){
                  echo $json_file[$i]."<br>";
                  $tab_nb++;
                  for($j=0;$j<$tab_nb;$j++){
                     echo html_entity_decode("&nbsp;&nbsp;&nbsp;&nbsp;");
                  }
               }else if($json_file[$i]=='}'){
                  echo "<br>";
                  for($j=0;$j<$tab_nb;$j++){
                     echo html_entity_decode("&nbsp;&nbsp;&nbsp;&nbsp;");
                  }
                  echo $json_file[$i]."<br>";
                  for($j=0;$j<$tab_nb;$j++){
                     echo html_entity_decode("&nbsp;&nbsp;&nbsp;&nbsp;");
                  }
                  $tab_nb--;
               }else{
                  echo $json_file[$i];
               }
            }
         ?>
      </div>
   </body>
</html>