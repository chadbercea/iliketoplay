# Deployment Guide

## Vercel Deployment

### Prerequisites

1. MongoDB Atlas cluster created
2. GitHub repository connected to Vercel
3. Domain `iliketoplay.co` accessible in registrar

### Environment Variables

**CRITICAL: Required for Production to Work**

The application requires TWO environment variables to function in production. Missing either will cause the app to break.

#### How to Set Environment Variables in Vercel

1. Go to https://vercel.com/dashboard
2. Select your project (`iliketoplay`)
3. Navigate to: **Settings → Environment Variables**
4. Click "Add" button
5. For each variable below:
   - Enter the variable name
   - Enter the value
   - Select: **Production, Preview, AND Development**
   - Click "Save"
6. After adding both variables: **Settings → Deployments → [latest deployment] → "Redeploy"**

#### Required Variables

**1. MONGODB_URI** (Database Connection)

```
mongodb+srv://iliketoplay-admin:PASSWORD@iliketoplay-dev.pljnw6d.mongodb.net/?appName=iliketoplay-dev
```

Replace `PASSWORD` with your actual MongoDB Atlas password.

**What happens if missing:**
- GET /api/games returns 500 error
- POST /api/games returns 400 error  
- Error: `connect ECONNREFUSED 127.0.0.1:27017`
- App stuck on "Loading games..."

---

**2. RAWG_API_KEY** (Game Data API)

```
your_32_character_api_key_here
```

Get your free API key from https://rawg.io/apidocs (20,000 requests/month free)

**What happens if missing:**
- GET /api/games/search returns 503 error
- Search shows: "RAWG API not configured. Please use manual entry."
- Can only add games manually (search doesn't work)

---

#### Verification

After setting environment variables and redeploying:

1. Visit https://iliketoplay.vercel.app/api/games
   - Should return: `{"success":true,"data":[...]}`
   - Should NOT return: 500 error or connection refused

2. Visit https://iliketoplay.vercel.app/games/new
   - Search for "Contra"
   - Should return game results
   - Should NOT show: "RAWG API not configured" error

**See [production-verification.md](./production-verification.md) for complete testing checklist.**

#### Security Notes

- Never commit `.env.local` to GitHub (already in `.gitignore`)
- Never commit API keys or passwords to git
- Store production secrets ONLY in Vercel dashboard
- Use different MongoDB clusters for development and production (recommended)
- Rotate credentials if accidentally exposed

### Deployment Steps

1. **Import to Vercel**
   - Go to https://vercel.com/new
   - Import your `iliketoplay` GitHub repository
   - Framework Preset: Next.js (auto-detected)

2. **Configure Environment Variables**
   - Add `MONGODB_URI` in Environment Variables section
   - Apply to: Production, Preview, and Development

3. **Deploy**
   - Click "Deploy"
   - Wait for build to complete

4. **Add Custom Domain**
   - Go to Project Settings → Domains
   - Add `iliketoplay.co`
   - Add `www.iliketoplay.co` (optional)
   - Update DNS records at your registrar:
     - Type: `A` Record
     - Name: `@`
     - Value: `76.76.21.21`
     - OR follow Vercel's specific DNS instructions

5. **Verify**
   - Visit https://iliketoplay.co
   - Test adding/viewing/deleting games
   - Check MongoDB Atlas Data Explorer to see data

### Automatic Deployments

Vercel automatically deploys when you:
- Push to `main` branch → Production deployment
- Push to other branches → Preview deployments
- Open pull requests → Preview deployments with unique URLs

### MongoDB Atlas Network Access

**Important:** Allow Vercel to access your database:

1. Go to MongoDB Atlas → Network Access
2. Click "Add IP Address"
3. Add: `0.0.0.0/0` (Allow access from anywhere)
   - This is required for Vercel's dynamic IPs
   - Your connection is still secured by username/password

### Monitoring

- **Vercel Logs:** Project → Deployments → Click deployment → View Function Logs
- **MongoDB Atlas:** Metrics → View cluster performance and queries
- **Vercel Analytics:** Automatically enabled for performance monitoring

### Rollback

If a deployment fails:
1. Go to Vercel → Deployments
2. Find last working deployment
3. Click "..." → "Promote to Production"

### Production Best Practices

1. **Use separate MongoDB clusters:**
   - Development: `iliketoplay-dev`
   - Production: `iliketoplay-prod`

2. **Enable MongoDB backups:**
   - Atlas → Backup → Enable Cloud Backup

3. **Set up monitoring:**
   - Vercel → Project Settings → Monitoring
   - Atlas → Alerts → Configure alert conditions

4. **Review logs regularly:**
   - Check for errors in Vercel function logs
   - Monitor MongoDB slow queries

### Troubleshooting

**Production shows "Loading games..." forever:**
- **Cause:** `MONGODB_URI` environment variable not set in Vercel
- **Error in logs:** `connect ECONNREFUSED 127.0.0.1:27017`
- **Fix:** Add `MONGODB_URI` in Vercel Settings → Environment Variables → Redeploy

**Search shows "RAWG API not configured":**
- **Cause:** `RAWG_API_KEY` environment variable not set in Vercel
- **Error:** GET /api/games/search returns 503
- **Fix:** Add `RAWG_API_KEY` in Vercel Settings → Environment Variables → Redeploy

**POST /api/games returns 400 error:**
- **Cause:** Database connection failed (missing `MONGODB_URI`)
- **Fix:** Verify `MONGODB_URI` is set correctly in Vercel
- **Test:** Run `curl https://your-domain.vercel.app/api/games` - should return 200, not 500

**Environment variables not taking effect:**
- **Cause:** Forgot to redeploy after adding environment variables
- **Fix:** Go to Settings → Deployments → Latest → Click "Redeploy"
- **Note:** Environment variable changes require redeployment to take effect

**Build fails:**
- Check Vercel build logs for errors
- Verify all dependencies in `package.json`
- Ensure Node.js version compatibility
- Check for TypeScript errors

**Database connection fails:**
- Verify `MONGODB_URI` is set in Vercel Environment Variables
- Check Atlas Network Access allows `0.0.0.0/0`
- Verify database user credentials are correct
- Ensure connection string format is correct (no spaces, correct password)

**Domain not working:**
- DNS propagation can take up to 48 hours
- Verify DNS records match Vercel requirements
- Check Vercel Domains dashboard for status

**How to check Vercel logs:**
1. Go to Vercel Dashboard → Your Project
2. Click "Deployments"
3. Click on the latest deployment
4. Click "View Function Logs"
5. Look for errors related to MongoDB or RAWG API

### Local Testing

Test locally before deploying:

```bash
# Start MongoDB (Docker)
docker-compose up -d

# Or use Atlas connection
# Update .env.local with Atlas URI

# Run development server
npm run dev

# Build production locally
npm run build
npm start
```

### Cost

- **MongoDB Atlas M0:** Free forever (512MB storage, shared resources)
- **Vercel Hobby:** Free (includes custom domains, automatic HTTPS)
- **Domain:** Varies by registrar (already owned: iliketoplay.co)

### Next Steps After Deployment

1. Set up MongoDB Atlas alerts
2. Configure Vercel notifications (Slack/Discord/Email)
3. Enable Vercel Analytics
4. Set up uptime monitoring (e.g., UptimeRobot)
5. Create production MongoDB cluster with backups

