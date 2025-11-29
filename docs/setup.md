# Setup Instructions

## Prerequisites

- Node.js 18+ and npm
- Docker and Docker Compose

## Installation Steps

### 1. Clone the Repository

```bash
git clone <repository-url>
cd iliketoplay
git checkout hello-world
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Start MongoDB

Using Docker Compose:

```bash
docker-compose up -d
```

This will start a MongoDB instance on `localhost:27017`.

### 4. Configure Environment Variables

Create a `.env.local` file in the project root:

```
MONGODB_URI=mongodb://localhost:27017/iliketoplay
```

### 5. Run the Development Server

```bash
npm run dev
```

The application will be available at [http://localhost:3000](http://localhost:3000).

## Stopping MongoDB

To stop the MongoDB container:

```bash
docker-compose down
```

To stop and remove all data:

```bash
docker-compose down -v
```

## Building for Production

```bash
npm run build
npm start
```

## Troubleshooting

### MongoDB Connection Issues

If you can't connect to MongoDB:

1. Ensure Docker is running
2. Check that the MongoDB container is running: `docker ps`
3. Verify the connection string in `.env.local`
4. Try restarting the container: `docker-compose restart`

### Port 3000 Already in Use

If port 3000 is already in use, you can specify a different port:

```bash
PORT=3001 npm run dev
```

### Port 27017 Already in Use

If you have another MongoDB instance running on port 27017, either:
- Stop the other instance
- Change the port mapping in `docker-compose.yml` and update `.env.local`

