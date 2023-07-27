Projet n°6 - Piquante : Construisez une API sécurisée pour une application d'avis gastronomiques

# téléchargement du PROJET ici :

$ git clone https://github.com/Lamouett3/P6_Piiquante

# Installation et mise en service du front et du back :

// Backend :

dans le terminal aller dans le dossier racine du backend :

$ cd backend

$ npm install

après, création du fichier .env à la racine du répertoire et y mettre les valeurs correctes pour se connecter à une base de donnée mongodb :

DB_PASSWORD="password de la base de donnée mongodb"

DB_CLUSTER = "cluster de la base de donnée mongodb"

TOKEN = "XXXXX"

; prendre le fichier .example.env, mettre les bonnes valeurs et modifier le nom du fichier en .env

puis dans le terminal :

$ nodemon serve

** Listening on port 3000 **

// frontend :

ouvrir un nouveau terminal aller dans le dossier racine du frontend :

$ cd frontend

$ npm install

$ npm start

** Angular Live Development Server is listening on localhost:4200, open your browser on http://localhost:4200/ **
