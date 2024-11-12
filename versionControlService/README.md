# Version Control Service

Ce service gère l'historique des versions des documents et permet de restaurer des versions antérieures.

## Installation

1. Clonez le dépôt.
2. Installez les dépendances avec `npm install`.
3. Configurez votre fichier `.env` avec `MONGO_URI`, `PORT`, et `KAFKA_BROKER`.
4. Démarrez le service avec `npm start`.

## API Endpoints

- **POST /api/version/version** : Sauvegarder une nouvelle version d'un document.
- **GET /api/version/history/:documentId** : Récupérer l'historique des versions d'un document.
- **GET /api/version/restore/:versionId** : Restaurer une version spécifique.
