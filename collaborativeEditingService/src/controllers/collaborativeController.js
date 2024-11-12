// src/controllers/collaborativeController.js
const CollaborativeSession = require('../models/CollaborativeSession');
const { kafkaProducer } = require('../kafka/kafkaConfig');
const redis = require('../../../redisConfig');  // Import Redis

// Création d'une nouvelle session collaborative
exports.createSession = async (req, res) => {
    try {
        const session = new CollaborativeSession({ documentId: req.body.documentId });
        await session.save();

        // Cache de la session
        await redis.set(`session:${session._id}`, JSON.stringify(session));

        res.status(201).json(session);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Envoi de modifications en temps réel
exports.sendEdit = async (req, res) => {
    try {
        const { documentId, userId, content } = req.body;

        // Envoi des données de modification à Kafka
        await kafkaProducer.send({
            topic: 'document-edits',
            messages: [
                { value: JSON.stringify({ documentId, userId, content }) }
            ],
        });

        // Invalidation du cache du document modifié si nécessaire
        await redis.del(`document:${documentId}`);

        res.status(200).json({ message: 'Modification envoyée' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Fin d'une session collaborative
exports.endSession = async (req, res) => {
    try {
        const session = await CollaborativeSession.findByIdAndDelete(req.params.id);
        if (!session) return res.status(404).json({ message: "Session non trouvée" });

        // Suppression de la session dans le cache
        await redis.del(`session:${req.params.id}`);

        res.status(200).json({ message: "Session terminée" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
