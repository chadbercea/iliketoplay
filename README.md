# I Like To Play

Retro Game Collection Tool - A web application for managing your retro video game collection.

## Tech Stack

- **Frontend**: Next.js 14 with TypeScript
- **UI**: Shadcn UI + Tailwind CSS
- **Database**: MongoDB
- **ODM**: Mongoose

## Features

- ✅ Add, edit, and delete games
- ✅ Track game details (title, platform, year, genre)
- ✅ Manage owned games vs wishlist
- ✅ Track condition and purchase information
- ✅ Add notes and cover images

## Getting Started

See [docs/setup.md](docs/setup.md) for detailed setup instructions.

### Quick Start

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start MongoDB:
   ```bash
   docker-compose up -d
   ```

3. Create `.env.local`:
   ```
   MONGODB_URI=mongodb://localhost:27017/iliketoplay
   ```

4. Run the development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000)

## Documentation

- [Setup Instructions](docs/setup.md)
- [API Documentation](docs/api.md)
- [Project Plan](docs/plan.md)

## License

MIT
