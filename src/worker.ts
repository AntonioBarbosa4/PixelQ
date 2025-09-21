import { Connection, ConsumerStatus } from 'rabbitmq-client';
import { config } from './config';
import { processVideoSchema } from './schemas';

const rabbitMqURI = Bun.env.RABBITMQ_URI || 'amqp://guest:guest@localhost:5672';

const rabbit = new Connection(rabbitMqURI);
rabbit.on('error', (err) => {
  console.log('RabbitMQ connection error', err);
});
rabbit.on('connection', () => {
  console.log('Connection successfully (re)established');
});

const sub = rabbit.createConsumer(
  {
    queue: config.queues.videoProcessing,
    queueOptions: { durable: true },
    qos: { prefetchCount: 1 },
  },
  async (msg) => {
    const videoDetail = processVideoSchema.safeParse(
      JSON.parse(msg.body.toString()),
    );

    if (!videoDetail.success) {
      return ConsumerStatus.DROP;
    }

    await new Promise((resolve) => setTimeout(resolve, 5000));

    console.log('process video:', videoDetail.data.videoId);

    return ConsumerStatus.ACK;
  },
);

sub.on('error', (error) => {
  console.log('consumer error (video_processing)', error.toString());
});

async function onShutdown() {
  await sub.close();
  await rabbit.close();
  process.exit();
}
process.on('SIGINT', onShutdown);
process.on('SIGTERM', onShutdown);
