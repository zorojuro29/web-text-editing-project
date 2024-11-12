// src/routes/collaborativeRoutes.js
const express = require('express');
const router = express.Router();
const collaborativeController = require('../controllers/collaborativeController');

// Route pour créer une session collaborative
router.post('/session', collaborativeController.createSession);

// Route pour envoyer une modification
router.post('/edit', collaborativeController.sendEdit);

// Route pour terminer une session collaborative
router.delete('/session/:id', collaborativeController.endSession);

module.exports = router;
