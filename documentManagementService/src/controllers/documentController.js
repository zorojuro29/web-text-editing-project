// src/controllers/documentController.js
const Document = require('../models/Document');
const redis = require('../../../redisConfig');  // Import Redis

// Création d'un document
exports.createDocument = async (req, res) => {
    try {
        const document = new Document(req.body);
        await document.save();
        console.log("uN doc a été crée");
        
        // Invalidation du cache si un nouveau document est créé
        await redis.del('documents');  // On peut supprimer tout le cache des documents

        res.status(201).json(document);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Récupération de tous les documents
exports.getDocuments = async (req, res) => {
    try {
        // Vérifier si les documents sont dans le cache Redis
        const cachedDocuments = await redis.get('documents');
        if (cachedDocuments) {
            console.log('Documents récupérés depuis le cache Redis');
            return res.status(200).json(JSON.parse(cachedDocuments));
        }

        const documents = await Document.find();
        
        // Sauvegarder les documents dans Redis pour une utilisation future
        await redis.setex('documents', 3600, JSON.stringify(documents)); // Cache pendant 1 heure

        res.status(200).json(documents);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Récupération d'un document par son ID
exports.getDocumentById = async (req, res) => {
    try {
        const documentId = req.params.id;

        // Vérifier si le document est en cache
        /*const cachedDocument = await redis.get(`document:${documentId}`);
        if (cachedDocument) {
            console.log("Document récupéré depuis le cache Redis");
            return res.status(200).json(JSON.parse(cachedDocument));
        }*/

        const document = await Document.findById(documentId);
        if (!document) return res.status(404).json({ message: "Document not found" });

        // Sauvegarder le document dans le cache Redis
        //await redis.setex(`document:${documentId}`, 3600, JSON.stringify(document)); // Cache pendant 1 heure

        res.status(200).json(document);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Récupération d'un document par son titre
exports.getDocumentByTitle = async (req, res) => {
    try {
        const title = req.params.title;

        // Vérifier si le document est dans le cache
        /*const cachedDocument = await redis.get(`document:title:${title}`);
        if (cachedDocument) {
            console.log('Document récupéré depuis le cache Redis');
            return res.status(200).json(JSON.parse(cachedDocument));
        }*/

        const document = await Document.findOne({ title });
        if (!document) return res.status(404).json({ message: "Document non trouvé" });

        // Sauvegarder le document dans Redis pour une utilisation future
        //await redis.setex(`document:title:${title}`, 3600, JSON.stringify(document)); // Cache pendant 1 heure

        res.status(200).json(document);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Mise à jour d'un document
exports.updateDocument = async (req, res) => {
    try {
        const document = await Document.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!document) return res.status(404).json({ message: "Document not found" });

        // Invalidation du cache du document mis à jour
        //await redis.del(`document:${req.params.id}`);

        res.status(200).json(document);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Suppression d'un document
exports.deleteDocument = async (req, res) => {
    try {
        const document = await Document.findByIdAndDelete(req.params.id);
        if (!document) return res.status(404).json({ message: "Document not found" });

        // Invalidation du cache du document supprimé
        //await redis.del(`document:${req.params.id}`);

        res.status(200).json({ message: "Document deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
