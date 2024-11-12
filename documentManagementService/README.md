# Document Service

Ce microservice gère la création, la récupération, la mise à jour et la suppression de documents.

## Installation

1. Configurez votre fichier `.env` en spécifiant `MONGO_URI` et `PORT`.
2. Dans `kafkaConfig.js`, dans `brokers`, saisissez votre <ip>:<port>.
3. Lancez le service avec `npm start`. Si on veut plutôt utiliser le load balancer et distribuer des instances du service aux différents clients pour gérer la charge, faites : 
    chmod +x start.sh
    ./start.sh

## API Endpoints

- **POST /api/documents** : Créer un nouveau document.
- **GET /api/documents** : Récupérer tous les documents.
- **GET /api/documents/:id** : Récupérer un document par ID.
- **GET /api/documents/title/:title** : Récupérer un document par son titre.
- **PUT /api/documents/:id** : Mettre à jour un document par ID.
- **DELETE /api/documents/:id** : Supprimer un document par ID.
