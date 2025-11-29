# Production Verification Checklist

This document outlines the complete verification process required before marking any deployment-related Linear issues as "Done".

## Prerequisites

All environment variables must be configured in Vercel before testing:

### Required Environment Variables

1. **MONGODB_URI**
   - Value: MongoDB Atlas connection string
   - Format: `mongodb+srv://[username]:[password]@[cluster].mongodb.net/?appName=[app-name]`
   - Applied to: Production, Preview, Development

2. **RAWG_API_KEY**
   - Value: RAWG API key from https://rawg.io/apidocs
   - Format: 32-character alphanumeric string
   - Applied to: Production, Preview, Development

### How to Set Environment Variables in Vercel

1. Go to https://vercel.com/dashboard
2. Select your project (`iliketoplay`)
3. Navigate to Settings → Environment Variables
4. Click "Add" for each variable
5. Enter name and value
6. Select environments: Production, Preview, Development
7. Click "Save"
8. Redeploy: Settings → Deployments → latest deployment → "Redeploy"

## Verification Tests

### 1. Database Connection Test

**Test:** Database connectivity and basic queries

```bash
curl https://iliketoplay.vercel.app/api/games
```

**Expected Result:**
- Status: 200 OK
- Response: `{"success": true, "data": [...]}`
- No `ECONNREFUSED` errors
- Returns array (empty or with games)

**Failure Indicators:**
- Status: 500
- Error: `connect ECONNREFUSED 127.0.0.1:27017`
- Error: `MongooseError: Operation buffering timed out`

**Fix:** Verify `MONGODB_URI` is set correctly in Vercel

---

### 2. RAWG API Test

**Test:** Game search functionality

1. Navigate to https://iliketoplay.vercel.app/games/new
2. Enter "Contra" in search field
3. Click "Search"

**Expected Result:**
- Results appear in dropdown
- No error messages
- Status: 200 on `/api/games/search?q=Contra`

**Failure Indicators:**
- Status: 503
- Error message: "RAWG API not configured. Please use manual entry."
- Empty results with red error banner

**Fix:** Verify `RAWG_API_KEY` is set correctly in Vercel

---

### 3. CRUD Operations Test

#### Add Game (via Search)

1. Go to https://iliketoplay.vercel.app/games/new
2. Search for "Super Mario Bros"
3. Select game from dropdown
4. Verify form pre-fills with game data
5. Click "Add Game"

**Expected Result:**
- Status: 201 on POST /api/games
- Redirects to home page
- New game appears in collection

**Failure Indicators:**
- Status: 400 or 500
- Form doesn't submit
- Error alert appears

---

#### Add Game (Manual Entry)

1. Go to https://iliketoplay.vercel.app/games/new
2. Click "Add Game Manually"
3. Fill in title: "Test Game"
4. Fill in platform: "NES"
5. Click "Add Game"

**Expected Result:**
- Status: 201 on POST /api/games
- Redirects to home page
- New game appears in collection

---

#### View Games

1. Go to https://iliketoplay.vercel.app/
2. Wait for games to load

**Expected Result:**
- Status: 200 on GET /api/games
- Games display in grid layout
- No "Loading games..." stuck state
- If empty: Shows "No games in your collection yet. Add your first game!"

---

#### Edit Game

1. Click "Edit" button on any game card
2. Modify title or other field
3. Click "Update Game"

**Expected Result:**
- Status: 200 on PUT /api/games/[id]
- Redirects to home page
- Game shows updated data

---

#### Delete Game

1. Click "Delete" button on any game card
2. Confirm deletion in browser dialog

**Expected Result:**
- Status: 200 on DELETE /api/games/[id]
- Game card disappears immediately
- No page reload needed

---

### 4. UI/UX Verification

#### Console Errors

Open browser DevTools → Console

**Expected Result:**
- No red errors
- No 404s for static assets
- No hydration mismatch warnings

---

#### Mobile Responsiveness

Test at different viewport sizes:
- Mobile: 375px × 667px (iPhone SE)
- Tablet: 768px × 1024px (iPad)
- Desktop: 1280px × 800px

**Expected Result:**
- Mobile: 1 column grid
- Tablet: 2 column grid
- Desktop: 3 column grid
- All buttons and text readable
- No horizontal scrolling
- No overlapping elements

---

#### Loading States

**Expected Result:**
- Initial load shows "Loading games..."
- Form submissions show loading state
- Search shows loading state
- Empty state displays when appropriate

---

### 5. Network Request Verification

Open browser DevTools → Network tab

**Expected Result:**
- All API requests return 2xx status codes
- No 500 errors
- No 503 errors
- Reasonable response times (< 3 seconds)

---

## Failure Response

If ANY test fails:

1. **DO NOT** mark Linear issues as "Done"
2. Document the failure in Linear comments
3. Update issue status to "In Progress" or "Backlog"
4. Fix the root cause
5. Re-run ALL verification tests
6. Only mark "Done" when ALL tests pass

## Success Criteria

Before marking deployment issues as "Done":

- [ ] All environment variables set in Vercel
- [ ] Redeployment completed successfully
- [ ] Database connection test passed
- [ ] RAWG API test passed
- [ ] Add game (search) test passed
- [ ] Add game (manual) test passed
- [ ] View games test passed
- [ ] Edit game test passed
- [ ] Delete game test passed
- [ ] No console errors
- [ ] Mobile responsive at 375px, 768px, 1280px
- [ ] Loading states working correctly
- [ ] All network requests return 2xx

## Post-Verification

After ALL tests pass:

1. Update Linear issues:
   - Add comment with verification results
   - Include screenshots of working features
   - Mark status as "Done"

2. Update project documentation:
   - Confirm live URL in README
   - Update deployment docs with lessons learned

3. Monitor production:
   - Check Vercel logs for errors
   - Monitor for 24 hours
   - Address any issues immediately

---

**Last Updated:** 2025-11-29
**Last Verified:** [Pending]
**Verified By:** [Pending]

