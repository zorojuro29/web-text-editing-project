// src/routes/versionRoutes.js
const express = require('express');
const router = express.Router();
const versionController = require('../controllers/versionController');

// Route pour sauvegarder une nouvelle version d'un document
router.post('/version', versionController.saveVersion);

// Route pour récupérer l'historique des versions d'un document
router.get('/history/:documentId', versionController.getDocumentHistory);

// Route pour restaurer une version spécifique
router.get('/restore/:versionId', versionController.restoreVersion);

module.exports = router;
