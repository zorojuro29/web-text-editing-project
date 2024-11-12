// src/kafka/kafkaConfig.js
const { Kafka, logLevel } = require('kafkajs');

const kafka = new Kafka({
    clientId: 'document-management-service',
    brokers: ['172.26.64.169:9093'],// [process.env.KAFKA_BROKER]//
    logLevel: logLevel.NOTHING, 
});

const kafkaProducer = kafka.producer();
const kafkaConsumer = kafka.consumer({ groupId: 'documents-group' });

async function initKafka() {
    await kafkaProducer.connect();
    await kafkaConsumer.connect();
}

initKafka();

module.exports = { kafkaProducer, kafkaConsumer };
