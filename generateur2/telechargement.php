<?php
    session_start();
    $file = 'json_zip.zip';
    header("Content-Type: application/zip");
    header("Content-Transfer-Encoding: Binary");
    header("Content-Length: ".filesize($file));
    header("Content-disposition: attachment; filename=json_zip.zip"); 
    readfile($file);

    $files = glob('images/*');
    foreach($files as $file){
        if(is_file($file) && basename($file)!="X.png") {
            unlink($file);
        }
    }

    unlink("test.zip");

    $_SESSION['json']['colonne'] = 0;
    $_SESSION['json']['ligne'] = 0;
    $_SESSION['json']['possibilites'] = null;
    file_put_contents('temp_fichier.json',json_encode($_SESSION['json']));
    header("Location: refresh.php");
?>

