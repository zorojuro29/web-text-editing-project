# Collaborative Service

Ce service permet l'édition collaborative en temps réel des documents.

## Installation

1. Configurez votre fichier `.env` en spécifiant `MONGO_URI` et `PORT`.
2. Dans `kafkaConfig.js`, dans `brokers`, saisissez votre <ip>:<port>.
3. Lancez le service avec `npm start`. Si on veut plutôt utiliser le load balancer et distribuer des instances du service aux différents clients pour gérer la charge, faites : 
    chmod +x start.sh
    ./start.sh

## API Endpoints

- **POST /api/collaborative/session** : Créer une session collaborative pour un document.
- **POST /api/collaborative/edit** : Envoyer une modification de document en temps réel.
- **DELETE /api/collaborative/session/:id** : Terminer une session collaborative.
