import { kafka } from '../config/kafka';
import { processMessage } from './consumer';

const producer = kafka.producer();
let isConnected = false;

export const connectProducer = async () => {
  try {
    await producer.connect();
    isConnected = true;
    console.log('Kafka Producer connected');
  } catch (error) {
    console.error('Failed to connect Kafka Producer:', error);
  }
};

export const publishEventUpdate = async (eventId: string) => {
  const value = JSON.stringify({ eventId, timestamp: new Date().toISOString() });
  
  if (!isConnected) {
    // Fallback: directly process if Kafka is not running locally
    await processMessage('event-updates', value);
    return;
  }
  
  try {
    await producer.send({
      topic: 'event-updates',
      messages: [{ value }],
    });
  } catch (err) {
    console.error('Failed to publish event update:', err);
  }
};

export const publishBookingConfirmation = async (userId: string, eventId: string, bookingId: string) => {
  const value = JSON.stringify({ userId, eventId, bookingId, timestamp: new Date().toISOString() });

  if (!isConnected) {
    // Fallback: directly process if Kafka is not running locally
    await processMessage('booking-confirmation', value);
    return;
  }

  try {
    await producer.send({
      topic: 'booking-confirmation',
      messages: [{ value }],
    });
  } catch (err) {
    console.error('Failed to publish booking confirmation:', err);
  }
};

export const disconnectProducer = async () => {
  if (isConnected) {
    await producer.disconnect();
  }
};
