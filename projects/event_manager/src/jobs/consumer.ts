import { kafka } from '../config/kafka';
import { db } from '../services/db';

const consumer = kafka.consumer({ groupId: 'event-booking-group' });

export const processMessage = async (topic: string, messageValue: string) => {
  const data = JSON.parse(messageValue);

  if (topic === 'booking-confirmation') {
    console.log(`[MOCK KAFKA] Booking confirmation email sent to user ${data.userId}`);
  } else if (topic === 'event-updates') {
    console.log(`[MOCK KAFKA] Users notified for event ${data.eventId}`);
    const affectedBookings = db.getBookingsByEvent(data.eventId);
    
    if (affectedBookings.length > 0) {
      affectedBookings.forEach(booking => {
        console.log(`[MOCK KAFKA] Sending notification to user: ${booking.userId} regarding event updates.`);
      });
    } else {
      console.log('[MOCK KAFKA] No users registered for this event yet, skipping individual notifications.');
    }
  }
};

export const startConsumer = async () => {
  try {
    await consumer.connect();
    console.log('Kafka Consumer connected');

    await consumer.subscribe({ topic: 'booking-confirmation', fromBeginning: false });
    await consumer.subscribe({ topic: 'event-updates', fromBeginning: false });

    await consumer.run({
      eachMessage: async ({ topic, partition, message }) => {
        if (!message.value) return;
        await processMessage(topic, message.value.toString());
      },
    });
  } catch (error) {
    console.error('Failed to start Kafka Consumer:', error);
  }
};

export const disconnectConsumer = async () => {
  try {
    await consumer.disconnect();
  } catch (err) {
    console.error('Failed to disconnect Consumer', err);
  }
};
