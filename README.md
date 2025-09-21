# PixelQ 🎬✨

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Tech: TypeScript](https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tech: Bun](https://img.shields.io/badge/Bun-000000?logo=bun&logoColor=white)](https://bun.sh/)
[![Tech: RabbitMQ](https://img.shields.io/badge/RabbitMQ-FF6600?logo=rabbitmq&logoColor=white)](https://www.rabbitmq.com/)
[![Tech: Docker](https://img.shields.io/badge/Docker-2496ED?logo=docker&logoColor=white)](https://www.docker.com/)

A simple proof-of-concept for an asynchronous video processing system, built with Node.js, RabbitMQ, and Docker.

## 📖 About The Project

PixelQ is a hands-on project created to study and demonstrate the **Work Queue** pattern using RabbitMQ.

It showcases how to decouple a web API from a background worker. The API instantly accepts a task and adds it to a message queue, while the actual processing is handled by one or more separate worker services. This architecture allows the system to be responsive and scalable.

### 🛠️ Tech Stack

* **Backend:** [Bun](https://bun.sh/), [TypeScript](https://www.typescriptlang.org/)
* **Messaging:** [RabbitMQ](https://www.rabbitmq.com/)
* **Validation:** [Zod](https://zod.dev/)
* **Containerization:** [Docker](https://www.docker.com/) & [Docker Compose](https://docs.docker.com/compose/)

## 🚀 Getting Started

Follow these steps to get the project running locally.

### Prerequisites

* [Docker](https://www.docker.com/get-started/) and [Docker Compose](https://docs.docker.com/compose/install/) must be installed.
* [Git](https://git-scm.com/) is required to clone the repository.

### Installation & Running the Project

1.  **Clone the repository:**
    ```sh
    git clone https://github.com/AntonioBarbosa4/PixelQ.git
    
    cd PixelQ
    ```


2.  **Start the services with Docker Compose:**
    This command will build and start the API, the worker, and a RabbitMQ instance.
    ```sh
    docker-compose up -d --build
    ```

The API will be available at `http://localhost:3000`, and the worker will be connected to RabbitMQ, ready to process tasks.

## ⚙️ Usage

To queue a new video for processing, send a `POST` request to the `/process-video` endpoint.

**Example cURL Request:**

```sh
curl --location 'http://localhost:3000/process-video' \
--header 'Content-Type: application/json' \
--data '{
    "videoId": "video-abc-123",
    "filePath": "/media/videos/holiday.mp4"
}'
```

The API will respond with `HTTP 204 No Content` to acknowledge that the task has been successfully queued.

### Observing the Workers

To see the workers in action, you can stream their logs:

```sh
docker-compose logs -f worker
```

You will see output like `process video: video-abc-123` as the worker picks up tasks from the queue.

### Scaling the Workers

To see horizontal scaling in action, you can easily increase the number of worker replicas:

```sh
# This scales the number of running workers to 3
docker-compose up -d --scale worker=3
```

Now, when you send new tasks, you'll see them being distributed among all running workers.

## 📜 License

Distributed under the MIT License. See the `LICENSE` file for more information.

## 👤 Contact


Project Link: [https://github.com/AntonioBarbosa4/PixelQ](https://github.com/AntonioBarbosa4/PixelQ)