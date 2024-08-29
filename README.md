# RoleMaster
_T211 - Développement Informatique 3_  
_par VERVAEREN Lucien & HUYBRECHTS Louis_  

## Tutoriel Démarrage
Pour démarrer le projet il faut lancer la partie fronted et la partie backend.  
Pour le frontend, à partir de la racine du projet :  
```web
>> cd web
>> npm install
>> ng serve
```  
Pour le backend, à partir de la racine du projet :  
```web
>> cd api
>> npm install
>> node server.js
```  
Le frontend est alors disponible à l'adresse [http://localhost:4200/](http://localhost:4200/).  
Le backend est alors disponible à l'adresse [http://localhost:3000/](http://localhost:3000/).  

Il faut créer la base de données et créer dans /api un fichier .env en copiant le fichier ENV_TO_COPY

## Documentation
La documentation de l'API est géré par Swagger et est disponible, après lancement du backend, à l'adresse [http://localhost:3000/docs/](http://localhost:3000/docs/).  