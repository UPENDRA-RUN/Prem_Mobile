# Prem Mobile — Deployment Guide

## Architecture
- **Frontend**: Vercel (React/Vite SPA)
- **Backend API**: Render (Express.js + SQLite)
- **Database**: SQLite on Render persistent disk
- **Image Uploads**: Cloudinary (client-side) + server fallback

---

## Step 1: Deploy Backend to Render

1. Push code to GitHub
2. Go to [render.com](https://render.com) → New → Web Service
3. Connect your GitHub repo
4. Settings:
   - **Name**: `prem-mobile-api`
   - **Runtime**: Node
   - **Build Command**: `npm install`
   - **Start Command**: `node server/server.js`
   - **Environment**: `NODE_ENV=production`
5. Add Environment Variables:
   - `NODE_ENV` = `production`
   - `CORS_ORIGIN` = `https://your-app.vercel.app` (set after Vercel deploy)
   - `ADMIN_JWT_SECRET` = a strong random secret
6. Go to Settings → Disk:
   - Mount Path: `/opt/render/project/src/server/data`
   - Size: 1 GB
7. Deploy. Note your Render URL (e.g., `https://prem-mobile-api.onrender.com`)

---

## Step 2: Deploy Frontend to Vercel

1. Go to [vercel.com](https://vercel.com) → New → Import Git Repository
2. Connect your GitHub repo
3. Framework Preset: **Vite**
4. Build Command: `npm run build`
5. Output Directory: `dist`
6. Add Environment Variable (if using Cloudinary):
   - `VITE_CLOUDINARY_CLOUD_NAME` = your cloud name
   - `VITE_CLOUDINARY_API_KEY` = your API key
7. Deploy

---

## Step 3: Update API URL

After Render is deployed, update `vercel.json`:

```json
{
  "rewrites": [
    {
      "source": "/api/:path*",
      "destination": "https://YOUR-RENDER-URL.onrender.com/api/:path*"
    },
    {
      "source": "/((?!api/).*)",
      "destination": "/index.html"
    }
  ]
}
```

Replace `YOUR-RENDER-URL` with your actual Render service URL, then redeploy on Vercel.

---

## Step 4: Configure CORS on Render

In Render Dashboard → Environment:
- Set `CORS_ORIGIN` = `https://YOUR-APP.vercel.app`

This ensures the backend accepts requests from your Vercel frontend.

---

## Step 5: Set Up UptimeRobot

1. Go to [uptimerobot.com](https://uptimerobot.com)
2. Add New Monitor → HTTP(s)
3. URL: `https://YOUR-RENDER-URL.onrender.com/api/health`
4. Monitoring Interval: 5 minutes
5. This keeps the Render service alive (free tier sleeps after inactivity)

---

## Step 6: Verify

1. Open your Vercel URL
2. Check that products, sales, and combos load
3. Log in to admin panel at `/admin/login`
4. Create a test product and verify it appears on the storefront
5. Test the health check: `https://YOUR-RENDER-URL.onrender.com/api/health`

---

## Troubleshooting

### API returns 404 or HTML error page
- Check that `vercel.json` has the correct Render URL
- Check Render logs for errors

### CORS errors in browser console
- Ensure `CORS_ORIGIN` is set on Render to match your Vercel URL
- Check for trailing slashes mismatch

### Images not loading after upload
- Cloudinary uploads happen directly from the browser (no backend needed)
- Server-side uploads go to `public/uploads/` — ensure Render persistent disk is mounted

### SSE (real-time) not working
- SSE goes through Vercel proxy to Render
- Check that `/api/events` returns `text/event-stream` content type

### Database resets after Render deploy
- Ensure persistent disk is mounted at `/opt/render/project/src/server/data`
- SQLite DB file: `server/data/prem_mobile.db`
