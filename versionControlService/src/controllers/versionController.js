// src/controllers/versionController.js
const Version = require('../models/Version');
const { kafkaProducer } = require('../kafka/kafkaConfig');
const redis = require('../../../redisConfig');  // Import Redis

// Sauvegarde d'une nouvelle version du document
exports.saveVersion = async (req, res) => {
    try {
        const { documentId, content, authorId } = req.body;
        const newVersion = new Version({ documentId, content, authorId });
        await newVersion.save();

        // Invalidation du cache de la version du document
        await redis.del(`document:${documentId}`);

        res.status(201).json(newVersion);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Récupération de l'historique des versions pour un document
exports.getDocumentHistory = async (req, res) => {
    try {
        const { documentId } = req.params;

        // Vérifier si l'historique des versions est dans le cache
        const cachedHistory = await redis.get(`document:history:${documentId}`);
        if (cachedHistory) {
            console.log('Historique récupéré depuis le cache Redis');
            return res.status(200).json(JSON.parse(cachedHistory));
        }

        const history = await Version.find({ documentId }).sort({ createdAt: -1 });

        // Sauvegarder l'historique des versions dans Redis
        await redis.setex(`document:history:${documentId}`, 3600, JSON.stringify(history)); // Cache pendant 1 heure

        res.status(200).json(history);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Restauration d'une version antérieure
exports.restoreVersion = async (req, res) => {
    try {
        const { versionId } = req.params;
        const version = await Version.findById(versionId);
        if (!version) return res.status(404).json({ message: 'Version introuvable' });

        // Envoyer une requête de restauration via Kafka à DocumentManagementService
        await kafkaProducer.send({
            topic: 'document-restore',
            messages: [
                {
                    value: JSON.stringify({
                        documentId: version.documentId,
                        content: version.content,
                    }),
                },
            ],
        });

        // Invalidation du cache du document après restauration
        await redis.del(`document:${version.documentId}`);
        
        res.status(200).json({ content: version.content });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
