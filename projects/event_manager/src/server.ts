import app from './app';
import { connectProducer, disconnectProducer } from './jobs/producer';
import { startConsumer, disconnectConsumer } from './jobs/consumer';

const PORT = process.env.PORT || 3000;

async function startServer() {
  // Start Kafka processes
  console.log('Starting Kafka consumers and producers...');
  await connectProducer();
  await startConsumer();

  const server = app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });

  // Graceful shutdown
  const shutdown = async () => {
    console.log('Shutting down server...');
    server.close(async () => {
      console.log('HTTP server closed.');
      await disconnectProducer();
      await disconnectConsumer();
      process.exit(0);
    });
  };

  process.on('SIGTERM', shutdown);
  process.on('SIGINT', shutdown);
}

startServer().catch(console.error);
