# 🩻 image-service

This project demonstrates a microservices architecture using Node.js, TypeScript, and Docker. The two services communicate via HTTP and are orchestrated through `docker-compose`.

- [🩻 image-service](#-image-service)
  - [🍽️ Services](#️-services)
  - [🐣 Getting started](#-getting-started)
    - [➡️ Contribute (dev)](#️-contribute-dev)
    - [➡️ Run (production)](#️-run-production)
  - [🌐 API](#-api)
  - [🎥 Demo](#-demo)
  - [🤖 Technical documentation](#-technical-documentation)
    - [🛠️ Typescript](#️-typescript)
    - [⚡ Volta](#-volta)
    - [🗄️ Database](#️-database)
    - [🧪 Tests](#-tests)
    - [🛜 Web server](#-web-server)
  - [🚀 Improvements](#-improvements)
  - [✍️ License](#️-license)



## 🍽️ Services

1. **Image Cache Service**
   - Manages a local image cache.
   - Provides endpoints to upload and retrieve images.

2. **Image Processing Service**
   - Applies processing (e.g., blurring) to images fetched from the cache service.

## 🐣 Getting started

### ➡️ Contribute (dev)

1. Clone the repository with `git clone`.
2. Make sure your node version is `node@22`. If you use `volta` it should automatically be set up with the right one.
3. Run `npm i` to install dependencies in both services.
4. Now you can
   1. Test your apps with `npm run test`
   2. Run your apps in dev mode with a watcher with `npm run dev`
   3. Build your apps with `npm run build`
5. If you have `make` available on your computer, you can run `make dev` to start both services with a watcher.

### ➡️ Run (production)

**Prerequisites:**
- Docker
- Docker Compose
- Make (optional)

**How to run:**

1. Build and run the services with `make run`
2. Check the services are running (see *infra*)
3. Stop the services with `make stop`
4. Clean up with `make clean`

**Checking services are running:**

- Image Cache Service: http://localhost:3000
- Image Processing Service: http://localhost:3001

> [!NOTE]
> Both should return a 200 with `{"status":"ok"}`


## 🌐 API

How to access the project?

Once running, 5 endpoints are available:
- a healthcheck, for both services:
  - at GET [http://127.0.0.1:3000](http://127.0.0.1:3000) for `image-cache` service
  - at GET [http://127.0.0.1:3001](http://127.0.0.1:3001) for `image-processor` service
- an endpoint to store an image in the service at POST [http://127.0.0.1:3000/images](http://127.0.0.1:3000/images), returning an `id`
- an endpoint to fetch an image in the service given its `id` at GET [http://127.0.0.1:3000/images/:id](http://127.0.0.1:3000/images/:id)
- an endpoint to fetch a blurred image in the service given its `id` at GET [http://127.0.0.1:3001/blurred-images/:id](http://127.0.0.1:3001/blurred-images/:id)

## 🎥 Demo

![demo](./assets/demo.gif)

## 🤖 Technical documentation
### 🛠️ Typescript
This project is written in [typescript](https://www.typescriptlang.org/), build with `tsc` and executable with `node`.

### ⚡ Volta

This project is using [volta](https://docs.volta.sh/guide/getting-started), the field `.volta` in `package.json` file can help to pin the node's version on our development computer.

### 🗄️ Database

This project doesn't use any database, everything is handled in memory. This is obviously not working for a real life usage, but for this technical test it is well enough.

### 🧪 Tests

Tests are using [node.js test runner](https://nodejs.org/api/test.html), a native module shipped with node since v16.17.0 and stable still v20.0.0

### 🛜 Web server

The web framework is [fastify](https://fastify.dev/) a fast alternative to express.js


## 🚀 Improvements
As this repository is a proof of concept, it isn't meant to be 💯% accurate; choices were made to implement it faster, and even if it is reflecting my quality standards I have identified a couple of improvements that could be made.
- Add automations to improve the devX, such as hooks to typecheck and lint on git commit, some CI to automatically run tests on pull request…
- Improve test strategy. For instance, the cache is emptied before running the attached test, this should not happen and we should have a way to mock this.
- Implement an api gateway. It would allow us to expose only one domain/port and proxy to the right service. Thanks to it, we would both enhance the user experience and force the developers to explicitly declare the available routes, improving security.
- Store images in a different place. The pictures are uploaded directly into the docker volume, but in a real-life environment they could be lost when releasing a new version if we use blue/green deployment for instance. Saving pictures in a different place (such as AWS S3 for instance) would preserve their persistency.
- Improve caching. For this project, images are cached in-memory. This is working for a PoC, but not in production: a release would restart the server and drop the cache, and there is no way to share a unique cache if multiple pods of the same instance are running to load balance. Depending on the policy we want to have, cache should be handled either with some improved in-memory data structure store such as [Redis](https://redis.io/) if performance is our main goal, or inside a database like [Postgresql](https://www.postgresql.org/) if persistency is the key element.
- Improve type safety: currently ids are stored as plain strings. It would be better to implement [branded types](https://dev.to/themuneebh/typescript-branded-types-in-depth-overview-and-use-cases-60e) to avoid mistakes if the project gets bigger.
- Add a security layer. This `image-service` works well but every one can access it. It would be nice to add some kind of security with a jwt for instance, as we definitely don't want to expose every uploaded image to people it doesn't belong to.
- Generate openApi files for each service, and use strongly typed clients. Doing so, we would prevent issues and contract breakings between various services leveraging the power of automatically generated clients.

## ✍️ License

Licensed under [Beer-ware](./LICENSE).