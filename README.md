# API REST liste des taches avec Node JS, Express et MongoDB
## Présentation
C'est une API faite pour la gestions des taches.

Il est développer avec le framework **Express JS** pour sa simple utilisation, **MongoDB** pour la base de données et le librairie **uuid** pour avoir des ID de type UUID.

Les routes sont protégées en utilisant **JWT** (jsonwebtoken)

La gestion des erreur est faite grace aux codes d'état (200, 201, 400...)
## Prérequis
+  NodeJS +20^
+  NPM
+  MongoDB Server

## Installation du projet 
1- Cloner le projet sur votre machine en tapant cette commande 
```bash
git clone https://github.com/bkrfeveo/api_rest_nodejs_mongodb.git
```
2- Initialiser npm et installer les dépendances
```bash
npm init -y
npm install 
```
3- Lancer le serveur node js
```bash
node app.js
```
4- Utiliser Postman pour tester les endpoints

## Base de données
Restaurer les données dans la base de données
```bash
cd api_rest_nodejs_mongodb/
mongorestore dump
```


## Endpoint 
Nous avons 7 endpoints dans l'API :
### User 
+ **POST ```/api/auth/register```** - Inscription
+ **POST ```/api/auth/login```** - Connexion et generation token jwt
### Tasks
+ **GET ```/api/tasks```** - Pour récupérer toutes les tâches
+ **GET ```/api/tasks/:id```** - Pour récupérer une tâche par ID
+ **POST ```/api/tasks```** - Pour créer une nouvelle tâche
+ **PUT ```/api/tasks/:id```** - Pour mettre à jour une tâche en utilisant son ID
+ **DELETE ```/api/tasks/:id```** - Pour supprimer une tâche en utilisant son ID

Les endpoints de tasks (CRUD) sont valides seulement si vous entrez un token valid qui est généré lors de la connexion.

## Code d'état utilisés dans ce projet

+ ```200```: La requête a été traitée avec succès
+ ```201```: La requête a réussi et une nouvelle ressource a été créée
+ ```400```: La requête du client est mal formée
+ ```403```: Non autorisé à acceder/recevoir la ressource demandée
+ ```404```: La ressource demandée n'a pas pu être trouvée sur le serveur.
+ ```500```: Erreur lors du traitement de la requête

