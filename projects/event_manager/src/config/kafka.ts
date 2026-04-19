import { Kafka } from 'kafkajs';

// Initialize the Kafka client. 
// Uses localhost:9092 by default. 
export const kafka = new Kafka({
  clientId: 'event-booking-system',
  brokers: ['localhost:9092'],
  // Reducing connection timeout and retry limits for graceful failure if local kafka isn't running
  retry: {
    initialRetryTime: 100,
    retries: 2
  }
});
