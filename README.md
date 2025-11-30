# I Like To Play

A modern, full-featured web application for managing your retro video game collection. Built with Next.js 16, featuring user authentication, advanced search, filtering, statistics, and a polished UI.

**Live Demo:** [https://iliketoplay.vercel.app/](https://iliketoplay.vercel.app/)

## Tech Stack

- **Frontend**: Next.js 16 (Turbopack) with TypeScript
- **UI**: Shadcn UI + Tailwind CSS (out-of-the-box components)
- **Database**: MongoDB (Atlas for production)
- **ODM**: Mongoose
- **Authentication**: NextAuth.js v5 (Auth.js) with Credentials provider
- **Deployment**: Vercel (automatic from `main` branch)
- **Data Source**: RAWG API for game lookups (with caching)
- **Search**: Fuse.js for client-side fuzzy search
- **Charts**: Recharts for statistics visualization
- **Notifications**: Sonner toast library

## Features

### 🎮 Game Management
- ✅ **RAWG API Integration** - Search 500k+ games with metadata
- ✅ **API Caching** - MongoDB cache for faster searches (7-day TTL)
- ✅ **Manual Entry Fallback** - Add games not in RAWG database
- ✅ **Full CRUD Operations** - Create, read, update, delete games
- ✅ **Rich Game Details** - Title, platform, year, genre, condition, purchase info, notes, cover art

### 🔍 Search & Organization
- ✅ **Fuzzy Search** - Real-time search across title, platform, genre, notes
- ✅ **Advanced Filtering** - Multi-select filters for platform, status, genre, condition
- ✅ **Sorting** - Sort by title, year, date added, platform (ascending/descending)
- ✅ **Status Management** - Owned games vs wishlist tracking

### 📊 Statistics & Insights
- ✅ **Collection Dashboard** - Total games, breakdowns by status/platform/genre/condition
- ✅ **Visual Charts** - Pie charts and lists for data visualization
- ✅ **Average Year** - Track the average release year of your collection
- ✅ **Tabbed Interface** - Separate Games and Stats views

### 🔐 User Experience
- ✅ **User Authentication** - Secure login/signup with NextAuth.js
- ✅ **Multi-User Support** - Each user has their own isolated collection
- ✅ **Toast Notifications** - Real-time feedback for all actions
- ✅ **Skeleton Loaders** - Smooth loading states
- ✅ **Animations** - Fade-in effects, staggered delays, smooth transitions
- ✅ **Responsive Design** - Mobile-first (1/2/3 column grid, 44px touch targets)
- ✅ **Accessibility** - ARIA labels, keyboard navigation, semantic HTML
- ✅ **Performance** - Code splitting, optimized animations, fast page loads

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
# Database
MONGODB_URI=mongodb://localhost:27017/iliketoplay

# RAWG API (get from https://rawg.io/apidocs)
RAWG_API_KEY=your_rawg_api_key_here

# NextAuth.js (generate secret: openssl rand -base64 32)
NEXTAUTH_SECRET=your_nextauth_secret_here
NEXTAUTH_URL=http://localhost:3000
```

For production (Vercel):
- Set `MONGODB_URI` to your MongoDB Atlas connection string
- Set `RAWG_API_KEY` to your RAWG API key
- Set `NEXTAUTH_SECRET` to a secure random string
- Set `NEXTAUTH_URL` to your production URL (https://yourdomain.com)
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
├── app/                      # Next.js app router pages
│   ├── api/                 # API routes
│   │   ├── auth/            # NextAuth.js routes (login, signup)
│   │   ├── games/           # Game CRUD endpoints
│   │   │   ├── [id]/        # Single game operations
│   │   │   └── search/      # RAWG API search endpoint
│   │   └── stats/           # Collection statistics
│   ├── games/               # Game management pages
│   │   ├── [id]/edit/       # Edit game page
│   │   └── new/             # Add game page
│   ├── login/               # Login page
│   ├── signup/              # Signup page
│   ├── home-content.tsx     # Home page client component
│   └── page.tsx             # Home page (protected)
├── components/              # React components
│   ├── ui/                  # Shadcn UI components
│   ├── auth-guard.tsx       # Client-side auth protection
│   ├── game-card.tsx        # Game display card
│   ├── game-card-skeleton.tsx # Loading skeleton
│   ├── game-form.tsx        # Add/Edit form
│   ├── game-list.tsx        # Game collection grid (search, filter, sort)
│   ├── game-search.tsx      # RAWG API search widget
│   ├── session-provider.tsx # NextAuth session wrapper
│   ├── stats-panel.tsx      # Statistics dashboard
│   └── user-menu.tsx        # User profile dropdown
├── lib/                     # Utilities
│   ├── auth.ts              # NextAuth.js configuration
│   ├── db.ts                # MongoDB connection (Mongoose)
│   ├── mongodb-client.ts    # MongoDB client (NextAuth adapter)
│   ├── rawg.ts              # RAWG API client
│   ├── utils.ts             # Utility functions (cn)
│   └── models/              # Mongoose schemas
│       ├── game.ts          # Game model (with userId)
│       └── game-cache.ts    # RAWG cache model
├── types/                   # TypeScript types
│   ├── game.ts              # Game interface
│   ├── game-cache.ts        # Cache interface
│   └── next-auth.d.ts       # NextAuth type extensions
└── middleware.ts            # Next.js middleware (auth passthrough)
```

## Testing & Quality Assurance

The app has been tested for:
- ✅ **Mobile responsiveness** - 375px to 1920px+ (44px touch targets)
- ✅ **User authentication** - Login, signup, logout, session management
- ✅ **Multi-user isolation** - Data privacy between users
- ✅ **CRUD operations** - Create, read, update, delete games
- ✅ **Search & filter** - Fuzzy search, multi-select filters, sorting
- ✅ **API integration** - RAWG search with caching
- ✅ **Form validation** - Client and server-side validation
- ✅ **Error handling** - Toast notifications for all errors
- ✅ **Loading states** - Skeleton screens, smooth transitions
- ✅ **Accessibility** - ARIA labels, keyboard navigation, semantic HTML
- ✅ **Performance** - Fast page loads, optimized animations
- ✅ **Browser compatibility** - Chrome, Firefox, Safari, Edge

## Development Phases

This project was built in 13 phases:
1. **Phase 1**: Project setup and initialization
2. **Phase 2**: RAWG API research and integration
3. **Phase 3**: MongoDB schema design
4. **Phase 4**: Core UI components (Shadcn)
5. **Phase 5**: CRUD operations
6. **Phase 6**: Initial polish and testing
7. **Phase 7**: API caching system
8. **Phase 8**: Authentication strategy research
9. **Phase 9**: User authentication implementation
10. **Phase 10**: Fuzzy search (Fuse.js)
11. **Phase 11**: Stats dashboard (Recharts)
12. **Phase 12**: Filtering and sorting
13. **Phase 13**: UI polish and final testing

All phases tracked in Linear.app with detailed documentation.

## License

MIT
