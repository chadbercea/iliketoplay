# I Like To Play - Prototype Setup Plan

## Tech Stack

- **Frontend**: Next.js 14 (App Router)
- **UI**: Shadcn UI (no customization)
- **Database**: MongoDB (Docker)
- **ODM**: Mongoose
- **Language**: TypeScript

## Database Schema

Game collection with fields:

- Title (string, required)
- Platform (string, required)
- Year (number)
- Genre (string)
- Status (enum: owned/wishlist)
- Cover image URL (string)
- Notes (text)
- Condition (enum: mint/excellent/good/fair/poor)
- Purchase info (price, date, location)

## Project Structure

```
/
├── docs/
│   └── plan.md
├── src/
│   ├── app/
│   │   ├── page.tsx (game list)
│   │   ├── games/
│   │   │   ├── new/page.tsx
│   │   │   └── [id]/edit/page.tsx
│   │   └── api/
│   │       └── games/
│   │           ├── route.ts
│   │           └── [id]/route.ts
│   ├── components/
│   │   ├── ui/ (shadcn components)
│   │   ├── game-card.tsx
│   │   ├── game-form.tsx
│   │   └── game-list.tsx
│   ├── lib/
│   │   ├── db.ts (MongoDB connection)
│   │   └── models/game.ts
│   └── types/
│       └── game.ts
├── docker-compose.yml
├── package.json
└── next.config.js
```

## Implementation Steps

### 1. Branch & Dependencies

- Create `hello-world` branch
- Initialize Next.js with TypeScript
- Install: mongoose, shadcn CLI
- Set up Shadcn UI (init)

### 2. Docker & Database

- Create `docker-compose.yml` with MongoDB service
- Create MongoDB connection utility `src/lib/db.ts`
- Define Game model with Mongoose `src/lib/models/game.ts`
- Add `.env.local` with connection string

### 3. API Routes

- GET/POST `/api/games` - List all games, create new game
- GET/PUT/DELETE `/api/games/[id]` - Get, update, delete specific game

### 4. UI Components

- Install needed Shadcn components: Button, Card, Form, Input, Select, Textarea, Label
- Build `game-form.tsx` (add/edit form)
- Build `game-card.tsx` (display single game)
- Build `game-list.tsx` (display all games)

### 5. Pages

- Home page: Game list with add button
- `/games/new`: Create game form
- `/games/[id]/edit`: Edit game form

### 6. Documentation

- Write setup instructions in `docs/setup.md`
- Document API endpoints in `docs/api.md`
- Move this plan to `docs/plan.md`

## Environment Variables

```
MONGODB_URI=mongodb://localhost:27017/iliketoplay
```

## Key Files to Create

- `docker-compose.yml` - MongoDB container
- `src/lib/db.ts` - Database connection
- `src/lib/models/game.ts` - Game schema
- `src/types/game.ts` - TypeScript types
- API routes for CRUD operations
- UI components using Shadcn
- Pages for listing, creating, editing games

