# I Like To Play

Retro Game Collection Tool - A web application for managing your retro video game collection.

**Live Demo:** [https://iliketoplay.vercel.app/](https://iliketoplay.vercel.app/)

## Tech Stack

- **Frontend**: Next.js 14 with TypeScript
- **UI**: Shadcn UI + Tailwind CSS (out-of-the-box components)
- **Database**: MongoDB (Atlas for production)
- **ODM**: Mongoose
- **Deployment**: Vercel
- **Data Source**: RAWG API for game lookups

## Features

- ✅ **Search & Add Games** - RAWG API integration with manual entry fallback
- ✅ **CRUD Operations** - Add, edit, view, and delete games
- ✅ **Game Details** - Track title, platform, year, genre, condition, purchase info
- ✅ **Status Management** - Owned games vs wishlist
- ✅ **Notes & Images** - Add personal notes and cover art URLs
- ✅ **Responsive Design** - Mobile-first layout (1/2/3 column grid)
- ✅ **Real-time Updates** - Instant UI updates on changes

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

## Environment Variables

Create a `.env.local` file in the root directory:

```env
MONGODB_URI=mongodb://localhost:27017/iliketoplay  # Local development
RAWG_API_KEY=your_rawg_api_key_here               # Get from https://rawg.io/apidocs
```

For production (Vercel):
- Set `MONGODB_URI` to your MongoDB Atlas connection string
- Set `RAWG_API_KEY` to your RAWG API key
- See [docs/deployment.md](docs/deployment.md) for detailed deployment instructions

## Production Deployment

This app is configured for Vercel deployment with automatic deployments from the `main` branch.

**Prerequisites:**
- MongoDB Atlas account (free M0 cluster)
- RAWG API key (free tier: 20k requests/month)
- Vercel account

See [docs/deployment.md](docs/deployment.md) for step-by-step deployment guide.

## Documentation

- [Setup Instructions](docs/setup.md) - Development environment setup
- [API Documentation](docs/api.md) - API endpoints and usage
- [Deployment Guide](docs/deployment.md) - Production deployment
- [RAWG Integration](docs/rawg-integration.md) - Game data API integration
- [Project Plan](docs/plan.md) - Development roadmap

## Project Structure

```
src/
├── app/                 # Next.js app router pages
│   ├── api/            # API routes
│   │   └── games/      # CRUD endpoints
│   ├── games/          # Game pages (new, edit)
│   └── page.tsx        # Home page
├── components/         # React components
│   ├── ui/            # Shadcn UI components
│   ├── game-card.tsx  # Game display card
│   ├── game-form.tsx  # Add/Edit form
│   ├── game-list.tsx  # Game collection grid
│   └── game-search.tsx # RAWG API search
├── lib/               # Utilities
│   ├── db.ts         # MongoDB connection
│   ├── rawg.ts       # RAWG API client
│   └── models/       # Mongoose schemas
└── types/            # TypeScript types
```

## Testing

The app has been tested for:
- ✅ Mobile responsiveness (375px - 1920px)
- ✅ CRUD operations (Create, Read, Update, Delete)
- ✅ Form validation and error handling
- ✅ API integration (RAWG search)
- ✅ Loading states and empty states
- ✅ Browser compatibility (Chrome, Firefox, Safari)

## License

MIT
