// src/index.js
const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/dbConfig");
const documentRoutes = require("./routes/documentRoutes");
const cors = require("cors");

// src/index.js
const { kafkaConsumer } = require("./kafka/kafkaConfig");
const Document = require("./models/Document");

dotenv.config();
connectDB();

const app = express();
app.use(express.json());
app.use(
  cors({
    origin: ["http://localhost:3000", "http://localhost:3002", "http://localhost:3003", "http://localhost:3007", "http://localhost:3008", "http://localhost:3009", "http://localhost:3010", "http://localhost:80"], // Autoriser les requêtes depuis ce domaine
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type"],
  })
);

app.use("/api/documents", documentRoutes);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Document Service running on port ${PORT}`);

  (async () => {
    await kafkaConsumer.subscribe({
      topic: "document-edits",
      fromBeginning: false,
    });

    await kafkaConsumer.run({
      eachMessage: async ({ message }) => {
        try {
          console.log("on est dans le consommateur kakfka de documentManagement")
          const editData = JSON.parse(message.value.toString());
          const { documentId, content } = editData;
          await Document.findByIdAndUpdate(
            documentId,
            { content },
            { new: true }
          );
          console.log(
            `Document ${documentId} mis à jour avec le contenu : ${content}`
          );
        } catch (error) {
          console.error(
            "Erreur lors de la mise à jour du document dans MongoDB :",
            error
          );
        }
      },
    });
  })();

  (async () => {
    await kafkaConsumer.subscribe({
      topic: "document-restore",
      fromBeginning: false,
    });

    await kafkaConsumer.run({
      eachMessage: async ({ message }) => {
        const restoreData = JSON.parse(message.value.toString());
        const { documentId, content } = restoreData;

        try {
          // Mise à jour du document avec le contenu de la version restaurée
          await Document.findByIdAndUpdate(
            documentId,
            { content },
            { new: true }
          );

          console.log(`Document ${documentId} restauré avec succès`);
        } catch (error) {
          console.error(
            `Erreur lors de la restauration du document ${documentId}:`,
            error
          );
        }
      },
    });
  })();
});
