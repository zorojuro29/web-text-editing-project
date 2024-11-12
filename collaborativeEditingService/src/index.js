// collaborativeEditingService/src/index.js
const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/dbConfig");
const collaborativeRoutes = require("./routes/collaborativeRoutes");
const { kafkaConsumer, kafkaProducer } = require("./kafka/kafkaConfig");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");


dotenv.config();
connectDB();

const app = express();
app.use(express.json());
app.use(
  cors({
    origin: ["http://localhost:3000", "http://localhost:3001", "http://localhost:3003", "http://localhost:3005", "http://localhost:3006", "http://localhost:3009", "http://localhost:3010", "http://localhost:80"], // Autoriser les requêtes depuis ce domaine
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type"],
  })
);

app.use("/api/collaborative", collaborativeRoutes);

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

const PORT = process.env.PORT || 3002;
server.listen(PORT, () => {
  console.log(`Collaborative Service running on port ${PORT}`);

  io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    socket.on("joinDocument", (documentId) => {
      socket.join(documentId);
      console.log(`User ${socket.id} joined document ${documentId}`);
    });

    socket.on("sendEdit", async (editData) => {
      const { documentId, userId, content } = editData;
      console.log("on est dans le socket.on de 'sendEdit'.");

      // Envoi des modifications à Kafka
      await kafkaProducer.send({
        topic: "document-edits",
        messages: [
          { value: JSON.stringify({ documentId, userId, content}) },
        ],
      });
    });

    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.id);
    });
  });

  (async () => {
    await kafkaConsumer.subscribe({ topic: "document-edits" });
    await kafkaConsumer.run({
      eachMessage: async ({ message }) => {
        const editData = JSON.parse(message.value.toString());
        const { documentId, content } = editData;

        // Propagation aux clients connectés
        io.to(documentId).emit("receiveEdit", {content});
      },
    });
  })();
});
