// src/models/CollaborativeSession.js
const mongoose = require('mongoose');

const collaborativeSessionSchema = new mongoose.Schema({
    documentId: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('CollaborativeSession', collaborativeSessionSchema);
