# jouer-a-deux
deploying the game on Heroku

nous avons mit le jeu online dans le cloud de Heroku, pour que le jeu soit disponible online

donc il y a deux possibilité pour tester le jeu
1) tester le jeu directement online, 
    Lien du jeu hebérgé dans le cloud heroku: https://jouer-a-deux.herokuapp.com/
2)tester le jeu en localhost 
   a) afin de tester le jeu en localhost, vous devez téléchager node.js(si ce n'est pas encore sur votre pc)
       https://nodejs.org/en/ (windows)
       nvm install 17.6.0 (buuntu)
       maintenant vous devez avoir node js version 17.6.0 et npm version 8.5.1

       pour vérifier  node -v    et npm -v .
         si npm n'est pas a jour: 
         tapez npm install -g npm@lastest (ubuntu) pour le mise a jour de npm
   b) aussi nous avos utilisé les sweetalert2 pour gérer les alerts dans notre code javascript
      donc il faut le télécharger(normalement pas besoin mais ou cas ou...): npm install sweetalert2 
   c) dès que vous avez téléchargé node.js et les sweetalerts2, localisez vous dans le répertoire du jeu et tapez: node server
   d) vous allez remarquer dans le terminale que le serveur écoute le port (lestning on) 3000, donc tout marche bien
   e) ouverez un navigateur et tapez http://127.0.0.1:3000/ (windows), http://localhost:3000/ (linux)

   lien githup de l'extension: https://github.com/AliMohammed232000/jouer-a-deux.git