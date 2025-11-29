# Deployment Guide

## Vercel Deployment

### Prerequisites

1. MongoDB Atlas cluster created
2. GitHub repository connected to Vercel
3. Domain `iliketoplay.co` accessible in registrar

### Environment Variables

**Required for Vercel:**

Add these in Vercel Dashboard → Settings → Environment Variables:

```
MONGODB_URI=mongodb+srv://iliketoplay-admin:PASSWORD@iliketoplay-dev.pljnw6d.mongodb.net/iliketoplay?retryWrites=true&w=majority&appName=iliketoplay-dev
```

Replace `PASSWORD` with your actual MongoDB Atlas password.

**Security Notes:**
- Never commit `.env.local` to GitHub (already in `.gitignore`)
- Store production secrets only in Vercel dashboard
- Use different MongoDB clusters for development and production (recommended)

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

**Build fails:**
- Check Vercel build logs for errors
- Verify all dependencies in `package.json`
- Ensure Node.js version compatibility

**Database connection fails:**
- Verify `MONGODB_URI` is set in Vercel
- Check Atlas Network Access allows `0.0.0.0/0`
- Verify database user credentials

**Domain not working:**
- DNS propagation can take up to 48 hours
- Verify DNS records match Vercel requirements
- Check Vercel Domains dashboard for status

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

