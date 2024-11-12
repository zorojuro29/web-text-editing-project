const Redis = require('ioredis');

const redis = new Redis({
    host: '127.0.0.1',   // Redis tourne en local
    port: 6379,          // Port par défaut de Redis
    password: '',        // Redis est protégé par mot de passe
});

module.exports = redis;
