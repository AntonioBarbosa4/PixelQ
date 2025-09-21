export const config = {
  rabbitMqURI: Bun.env.RABBITMQ_URI || 'amqp://guest:guest@localhost:5672',
  queues: {
    videoProcessing: 'video_processing_queue',
  },
};
