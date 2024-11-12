// src/config/dbConfig.js
const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useFindAndModify: false,
        });
        console.log('MongoDB connecté pour le service de contrôle de version');
    } catch (error) {
        console.error('Erreur de connexion MongoDB :', error);
        process.exit(1);
    }
};

module.exports = connectDB;