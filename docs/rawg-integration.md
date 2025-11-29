# RAWG API Integration

## Overview

The app integrates with the RAWG Video Games Database API to provide game search functionality. This allows users to search for games and automatically populate game details instead of manual entry.

**RAWG API:** https://rawg.io/apidocs

## Features

- Search for games by title
- Filter by platform (NES, SNES, etc.)
- Automatic data population (title, platform, year, genre, cover image)
- Graceful fallback to manual entry if API is unavailable
- No authentication complexity (simple API key)

## API Limits

- **Free Tier:** 20,000 requests/month
- **No OAuth:** Just add API key to environment variables
- **Rate Limit:** Sufficient for personal collection management

## Setup

### 1. Get API Key

1. Visit https://rawg.io/apidocs
2. Sign up for a free account
3. Navigate to API section
4. Generate API key

### 2. Add to Environment Variables

**Local Development (.env.local):**
```
RAWG_API_KEY=your_api_key_here
```

**Production (Vercel):**
1. Go to Project Settings → Environment Variables
2. Add `RAWG_API_KEY` with your key
3. Apply to Production, Preview, and Development

### 3. Restart Development Server

```bash
npm run dev
```

## Usage Flow

1. User clicks "Add Game"
2. Search interface appears by default
3. User searches for game (e.g., "Super Mario Bros")
4. Results display with cover art and metadata
5. User selects game from results
6. Form pre-fills with game data
7. User can edit any field before saving
8. User can also click "Add Game Manually" to skip search

## Architecture

### Files Created

- `src/lib/rawg.ts` - RAWG API client
- `src/app/api/games/search/route.ts` - Search endpoint
- `src/components/game-search.tsx` - Search UI component
- `src/components/game-form.tsx` - Updated with search mode

### API Client (`src/lib/rawg.ts`)

**Functions:**
- `searchGames(query, platform?)` - Search for games
- `getGameDetails(gameId)` - Get detailed game info
- `rawgToGameData(rawgGame)` - Convert RAWG format to our format

**Platform Filtering:**
Supported platforms with RAWG IDs:
- NES: 49
- SNES: 83
- Genesis: 167
- Game Boy: 26

### Search Endpoint (`/api/games/search`)

**Query Parameters:**
- `q` (required) - Search query
- `platform` (optional) - Filter by platform

**Response:**
```json
{
  "success": true,
  "count": 10,
  "data": [
    {
      "rawgId": 123,
      "title": "Super Mario Bros.",
      "platform": "NES",
      "year": 1985,
      "genre": "Platformer",
      "coverImageUrl": "https://...",
      "notes": "Added from RAWG. Rating: 4.5/5"
    }
  ]
}
```

**Error Response:**
```json
{
  "success": false,
  "error": "Error message",
  "fallbackToManual": true
}
```

## Error Handling

The integration includes comprehensive error handling:

1. **API Key Missing:** Returns 503 with fallback message
2. **API Down:** Returns 500 with fallback message
3. **No Results:** Shows message and manual entry option
4. **Rate Limit Hit:** Gracefully falls back to manual entry

All errors include `fallbackToManual: true` flag to guide UI.

## Testing

### Manual Testing Checklist

1. ✅ Search for "Super Mario Bros" → verify NES results appear
2. ✅ Select a game → verify form pre-fills correctly
3. ✅ Edit pre-filled data → verify changes persist
4. ✅ Search with no results → verify manual entry option shows
5. ✅ Remove RAWG_API_KEY → verify graceful fallback
6. ✅ Save selected game → verify saves to MongoDB correctly

### Test Without API Key

To test manual-only mode:
1. Remove `RAWG_API_KEY` from `.env.local`
2. Restart dev server
3. Try to search → should show error and manual entry option

## Monitoring

### Check API Usage

RAWG provides usage statistics in your account dashboard:
- View requests per month
- Monitor rate limits
- Track API performance

### Vercel Logs

Monitor API calls in production:
```
Vercel Dashboard → Project → Deployments → View Function Logs
```

Filter for `/api/games/search` to see search activity.

## Future Enhancements

Potential improvements:

1. **Caching:** Cache search results in MongoDB to reduce API calls
2. **Multiple Platforms:** Support filtering by multiple platforms
3. **Advanced Search:** Add genre, year filters
4. **Image Optimization:** Use Next.js Image component for cover art
5. **Autocomplete:** Add live search suggestions as user types
6. **TheGamesDB Integration:** Add secondary API for better retro coverage

## Troubleshooting

### Search Not Working

**Problem:** Search button does nothing
**Solution:** Check browser console for errors, verify API key is set

**Problem:** "RAWG API not configured" error
**Solution:** Add RAWG_API_KEY to .env.local and restart server

**Problem:** "Search failed" errors
**Solution:** Check API key is valid, verify RAWG API status

### No Results Found

**Problem:** Searching returns no results
**Solution:** 
- Try different search terms
- Check if game exists in RAWG database
- Use manual entry as fallback

### Rate Limit Exceeded

**Problem:** 20,000 requests/month exceeded
**Solution:**
- Wait for monthly reset
- Implement caching to reduce API calls
- Use manual entry mode
- Upgrade RAWG plan if needed

## Cost

**Free Forever:**
- 20,000 API requests/month
- No credit card required
- No expiration

For personal game collection management, free tier is sufficient.

## Security

**API Key Protection:**
- Never commit `.env.local` to git (in `.gitignore`)
- Store production key in Vercel environment variables
- API key only accessible server-side (Next.js API routes)
- No client-side exposure

## Resources

- **RAWG API Docs:** https://rawg.io/apidocs
- **RAWG Website:** https://rawg.io
- **Rate Limits:** https://rawg.io/apidocs#section/Rate-limiting

