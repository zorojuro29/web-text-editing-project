// src/routes/documentRoutes.js
const express = require('express');
const router = express.Router();
const documentController = require('../controllers/documentController');

// Route pour créer un document
router.post('/', documentController.createDocument);

// Route pour récupérer tous les documents
router.get('/', documentController.getDocuments);

// Route pour récupérer un document par ID
router.get('/:id', documentController.getDocumentById);

// Route pour récupérer un document par son titre
router.get('/title/:title', documentController.getDocumentByTitle);

// Route pour mettre à jour un document
router.put('/:id', documentController.updateDocument);

// Route pour supprimer un document
router.delete('/:id', documentController.deleteDocument);

module.exports = router;
