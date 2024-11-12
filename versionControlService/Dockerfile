# Utiliser l'image de base Node.js
FROM node:14

# Définir le répertoire de travail
WORKDIR /app

# Copier package.json et package-lock.json
COPY package*.json ./

# Installer les dépendances
RUN npm install

# Copier le reste du code
COPY . .

# Exposer le port défini dans .env
EXPOSE 3003

# Démarrer le service
CMD ["node", "src/index.js"]
