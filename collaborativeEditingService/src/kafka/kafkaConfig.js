// src/kafka/kafkaConfig.js
const { Kafka } = require('kafkajs');

const kafka = new Kafka({
    clientId: 'collaborative-service',
    brokers: ['172.26.64.169:9093']// [process.env.KAFKA_BROKER]//
});

const kafkaProducer = kafka.producer();
const kafkaConsumer = kafka.consumer({ groupId: 'collaboration-group' });

async function initKafka() {
    await kafkaProducer.connect();
    await kafkaConsumer.connect();
}

initKafka();

module.exports = { kafkaProducer, kafkaConsumer };
