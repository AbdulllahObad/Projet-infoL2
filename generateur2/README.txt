Afin d'utiliser le generateur,
Si vous êtes sur un pc de la fac :
 Ouvrir un terminal, on se localise grace à la commande "cd" dans le path du generateur,
 ensuite on tape la commande suivante afin d'ouvrir un serveur : 
	
	php -S localhost:8080

	Sur le navigateur taper : 
    		http://localhost:8080/jeu2.php


Fonctionnalité des boutons : 

Vide grille : rénitialise la grille
Valider : Fait apparaitre la grille voulu
ajoute argument : ajoute les arguments voulu
Telecharger : telecharge le fichier json

Si vous êtes sur windows ou sur votre ordinateur personnel il est obligatoire de telecharger xampp et de mettre le dossier generateur dans le dossier httdocs.
Vous pouvez également utiliser un serveur local de votre choix si vous y êtes plus à l'aise.

Enfin, lorsque vous aurez telecharger le fichier, il sera sous format zip avec un dossier contenant les images utilisés dans votre grille
ainsi qu'un fichier json.
Afin de pouvoir l'utiliser dans le jeu, il suffira de placer le dossier d'images dans le dossier du jeu 
et le fichier json dans le dossier "js" qui est présent dans le dossier du jeu	

PS : 

-S'il vous plait veuillez à bien utilisé la version du jeu que je vous ai envoyé par mail afin de bien faire fonctionner le json générer.

-Attention malheureusement il est impossible de modifier des arguments déjà ajouter donc faites attention lorsque vous ajoutez des arguments
Si malgré tout vous voulez modifier un argument il faudra reset le tableau.