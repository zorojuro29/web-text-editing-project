# Collaborative Service

Ce service permet l'édition collaborative en temps réel des documents.

## Installation

1. Configurez votre fichier `.env` en spécifiant `MONGO_URI`, `PORT`, et `KAFKA_BROKER`.
2. Lancez un serveur Kafka via Docker:
    docker run -d \
    --name zookeeper \
    -p 2181:2181 \
    zookeeper

    docker run -d \
    --name kafka \
    --link zookeeper:zookeeper \
    -p 9092:9092 \
    -e KAFKA_ADVERTISED_LISTENERS=PLAINTEXT://localhost:9092 \
    -e KAFKA_LISTENERS=PLAINTEXT://0.0.0.0:9092 \
    -e KAFKA_ZOOKEEPER_CONNECT=zookeeper:2181 \
    bitnami/kafka


5. Lancez le service avec `npm start`.

## API Endpoints

- **POST /api/collaborative/session** : Créer une session collaborative pour un document.
- **POST /api/collaborative/edit** : Envoyer une modification de document en temps réel.
- **DELETE /api/collaborative/session/:id** : Terminer une session collaborative.
