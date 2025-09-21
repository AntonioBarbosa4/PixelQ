import { Connection } from 'rabbitmq-client';
import { config } from './config';
import { processVideoSchema } from './schemas';

const rabbitMqURI = Bun.env.RABBITMQ_URI || 'amqp://guest:guest@localhost:5672';
const port = Bun.env.PORT || 3000;

const rabbit = new Connection(rabbitMqURI);

rabbit.on('connection', () => {
  console.log('Connection successfully (re)established');
});
rabbit.on('error', (error) => {
  console.log('RabbitMQ connection error', error.toString());
});

const publisher = rabbit.createPublisher({
  confirm: true,
  maxAttempts: 3,
  queues: [{ queue: 'video_processing', durable: true }],
});

const queue = 'video_processing';

const server = Bun.serve({
  port,
  async fetch(req) {
    const url = new URL(req.url);

    if (req.method === 'POST' && url.pathname === `/process-video`) {
      try {
        let reqBody = null;

        try {
          reqBody = await req.json();
        } catch (error) {
          return new Response(JSON.stringify({ message: 'Invalid JSON' }), {
            status: 400,
          });
        }

        const bodyParser = processVideoSchema.safeParse(reqBody);

        if (!bodyParser.success) {
          return new Response(
            JSON.stringify({
              message: 'Validation error',
              issues: bodyParser.error.issues,
            }),
            {
              status: 400,
            },
          );
        }
        await publisher.send(
          config.queues.videoProcessing,
          JSON.stringify(bodyParser.data),
        );

        return new Response(null, {
          status: 204,
          headers: { 'Content-Type': 'application/json' },
        });
      } catch (error: unknown) {
        console.log(error);
        return new Response(null, {
          status: 500,
          headers: { 'Content-Type': 'application/json' },
        });
      }
    }

    return new Response(JSON.stringify({ message: 'Not found.' }), {
      headers: { 'Content-Type': 'application/json' },
      status: 404,
    });
  },
});

console.info(`Listening on http://localhost:${server.port} 🚀...`);

async function onShutdown() {
  await publisher.close();
  await rabbit.close();
  process.exit();
}

process.on('SIGINT', onShutdown);
process.on('SIGTERM', onShutdown);
