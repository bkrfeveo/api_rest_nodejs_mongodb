# API REST liste des taches avec Node JS, Express et MongoDB
## Présentation
C'est une API faite pour la gestions des taches.

Il est développer avec le framework **Express JS** pour sa simple utilisation et le librairie **uuid** pour avoir des ID de type UUID.

La gestion des erreur est faite grace aux codes d'état (200, 201, 400...)

## Installation du projet 
1- Cloner le projet sur votre machine en tapant cette commande 
```bash
git clone https://github.com/bkrfeveo/api_rest_nodejs.git
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
4- Allez dans votre navigateur à l'adresse  [http://localhost:3000](http://localhost:3000/)


## Endpoint 
Nous avons 5 endpoints dans l'API :

+ **GET ```/api/tasks```** - Pour récupérer toutes les tâches
+ **GET ```/api/tasks/:id```** - Pour récupérer une tâche par ID
+ **POST ```/api/tasks```** - Pour créer une nouvelle tâche
+ **PUT ```/api/tasks/:id```** - Pour mettre à jour une tâche en utilisant son ID
+ **DELETE ```/api/tasks/:id```** - Pour supprimer une tâche en utilisant son ID

## Code d'état utilisés dans ce projet

+ ```200```: La requête a été traitée avec succès
+ ```201```: La requête a réussi et une nouvelle ressource a été créée
+ ```400```: La requête du client est mal formée
+ ```404```: La ressource demandée n'a pas pu être trouvée sur le serveur.

