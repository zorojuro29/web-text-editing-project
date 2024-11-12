// src/models/Version.js
const mongoose = require('mongoose');

const versionSchema = new mongoose.Schema({
    documentId: { type: String, required: true },
    content: { type: String, required: true },
    authorId: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Version', versionSchema);
