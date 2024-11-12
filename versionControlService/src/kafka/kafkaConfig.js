// src/kafka/kafkaConfig.js
const { Kafka } = require('kafkajs');
const Version = require('../models/Version');

const kafka = new Kafka({
    clientId: 'version-control-service',
    brokers: ['172.26.64.169:9093']
});

const kafkaConsumer = kafka.consumer({ groupId: 'version-control-group' });
const kafkaProducer = kafka.producer();


async function initKafka(){
    await kafkaConsumer.connect();
    await kafkaProducer.connect();
}

initKafka();

module.exports = {kafkaConsumer, kafkaProducer};
