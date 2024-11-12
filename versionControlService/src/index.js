// src/index.js
const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/dbConfig");
const versionRoutes = require("./routes/versionRoutes");
const {kafkaConsumer} = require("./kafka/kafkaConfig");
const Version = require("./models/Version");
const cors = require("cors");

dotenv.config();
connectDB();

const app = express();
app.use(express.json());
app.use(cors({
  origin: ["http://localhost:3000", "http://localhost:3001", "http://localhost:3002", "http://localhost:3007", "http://localhost:3008", "http://localhost:3005", "http://localhost:3006"], // Autoriser les requêtes depuis ce domaine
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type"],
}));

app.use("/api/version", versionRoutes);

const PORT = process.env.PORT || 3003;
app.listen(PORT, () => {
  console.log(`Version Control Service running on port ${PORT}`);

  // Initialisation du compteur pour chaque document
  //const modificationCounters = {};
  //const n = 20; // Nombre de modifications avant de sauvegarder une version

  (async () => {
    await kafkaConsumer.subscribe({ 
        topic: "document-edits", 
        fromBeginning: false
     });

    await kafkaConsumer.run({
      eachMessage: async ({ message }) => {
        const editData = JSON.parse(message.value.toString());

        if (!modificationCounters[editData.documentId]) {
          modificationCounters[editData.documentId] = 0;
        }

        // Incrémenter le compteur de modifications pour le document
        modificationCounters[editData.documentId] += 1;

        // Sauvegarder chaque modification comme une nouvelle version
        const newVersion = new Version({
          documentId: editData.documentId,
          content: editData.content,
          authorId: editData.userId,
        });

        if (modificationCounters[editData.documentId] >= n) {
          await newVersion.save();
          modificationCounters[editData.documentId] = 0; // Réinitialiser le compteur après sauvegarde
        }
      },
    });
  })();
});
