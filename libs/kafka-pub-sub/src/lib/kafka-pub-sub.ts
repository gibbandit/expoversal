import { Kafka } from 'kafkajs';
import { KafkaPubSub } from 'graphql-kafkajs-subscriptions';

const kafka = new Kafka({
  clientId: 'msg-sub-service',
  brokers: ['localhost:9092'],
});

export const pubsub = KafkaPubSub.create({
  topic: 'message-topic',
  kafka: kafka,
  groupIdPrefix: 'msggql',
});
