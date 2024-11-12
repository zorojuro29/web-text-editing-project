# Version Control Service

Ce service gère l'historique des versions des documents et permet de restaurer des versions antérieures.

## Installation

1. Configurez votre fichier `.env` en spécifiant `MONGO_URI` et `PORT`.
2. Dans `kafkaConfig.js`, dans `brokers`, saisissez votre <ip>:<port>.
3. Lancez le service avec `npm start`. Si on veut plutôt utiliser le load balancer et distribuer des instances du service aux différents clients pour gérer la charge, faites : 
    chmod +x start.sh
    ./start.sh

## API Endpoints

- **POST /api/version/version** : Sauvegarder une nouvelle version d'un document.
- **GET /api/version/history/:documentId** : Récupérer l'historique des versions d'un document.
- **GET /api/version/restore/:versionId** : Restaurer une version spécifique.
