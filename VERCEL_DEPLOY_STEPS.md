# 🚀 Vercel Deployment - Step by Step Guide

Follow these steps to deploy your Terrawise Ventures app to Vercel:

## Prerequisites Checklist

- [ ] GitHub account with your repository
- [ ] Vercel account (free tier works)
- [ ] Neon database (or PostgreSQL database) with connection string
- [ ] (Optional) Email service credentials
- [ ] (Optional) SMS service API key

---

## Step 1: Create/Login to Vercel Account

1. Go to [vercel.com](https://vercel.com)
2. Click **"Sign Up"** or **"Log In"**
3. Choose **"Continue with GitHub"** (recommended for easy integration)

---

## Step 2: Import Your GitHub Repository

1. In Vercel dashboard, click **"Add New..."** → **"Project"**
2. Find your repository: **`Niketh-Putta/Terrawise-Ventures`**
3. Click **"Import"**

---

## Step 3: Configure Project Settings

Vercel should auto-detect settings from `vercel.json`, but verify:

- **Framework Preset**: Leave as "Other" or "Vite" (auto-detected)
- **Root Directory**: `./` (root)
- **Build Command**: `npm run build` ✅ (already set)
- **Output Directory**: `dist/public` ✅ (already set)
- **Install Command**: `npm install` (default)

**Click "Deploy"** - but wait! ⚠️ Don't deploy yet, we need to set environment variables first.

---

## Step 4: Set Environment Variables

**Before deploying**, click **"Environment Variables"** in the project settings:

### Required Variables:

```bash
# Database (REQUIRED)
DATABASE_URL=postgresql://user:password@host:port/database?sslmode=require

# Session Secret (REQUIRED - generate a random string)
SESSION_SECRET=your-super-secret-random-string-here-min-32-chars
```

### Optional Variables (for full functionality):

```bash
# Email Service (Optional - for email monitoring)
EMAIL_HOST=imap.gmail.com
EMAIL_PORT=993
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password

# SMS Service (Optional - for OTP)
FAST2SMS_API_KEY=your-fast2sms-api-key

# Twilio (Alternative SMS - Optional)
TWILIO_ACCOUNT_SID=your-twilio-sid
TWILIO_AUTH_TOKEN=your-twilio-token
TWILIO_PHONE_NUMBER=+1234567890
```

### How to Add Environment Variables:

1. In Vercel project settings, go to **"Settings"** → **"Environment Variables"**
2. Click **"Add New"**
3. Enter the **Name** and **Value**
4. Select environments: **Production**, **Preview**, and **Development** (or just Production)
5. Click **"Save"**
6. Repeat for each variable

### Generate SESSION_SECRET:

Run this command to generate a secure random string:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

---

## Step 5: Deploy!

1. Go back to **"Deployments"** tab
2. Click **"Redeploy"** on the latest deployment (or trigger a new one)
3. Wait 1-2 minutes for build to complete
4. ✅ Your site will be live!

---

## Step 6: Verify Deployment

1. Click on your deployment to see the **"Visit"** button
2. Test your website:
   - Homepage loads ✅
   - Projects page works ✅
   - API endpoints work (check browser console)
   - Forms submit correctly ✅

---

## Step 7: Set Up Custom Domain (Optional)

1. Go to **"Settings"** → **"Domains"**
2. Add your custom domain
3. Follow DNS configuration instructions
4. Wait for SSL certificate (automatic, ~5 minutes)

---

## Troubleshooting

### Build Fails

**Error: "DATABASE_URL must be set"**
- ✅ Solution: Add `DATABASE_URL` environment variable

**Error: Build timeout**
- ✅ Solution: Check build logs, may need to optimize build

**Error: Module not found**
- ✅ Solution: Ensure all dependencies are in `package.json`

### Runtime Errors

**Error: "Cannot connect to database"**
- ✅ Check `DATABASE_URL` format
- ✅ Ensure database allows connections from Vercel IPs
- ✅ For Neon: Check connection string includes `?sslmode=require`

**Error: "Session secret not set"**
- ✅ Add `SESSION_SECRET` environment variable

### API Routes Not Working

- ✅ Check Vercel function logs in dashboard
- ✅ Verify `api/index.ts` exists
- ✅ Check that routes start with `/api/`

---

## Quick Deploy Checklist

- [ ] Vercel account created
- [ ] GitHub repo imported to Vercel
- [ ] `DATABASE_URL` environment variable set
- [ ] `SESSION_SECRET` environment variable set
- [ ] Optional variables set (if needed)
- [ ] Deployment triggered
- [ ] Website tested and working

---

## Post-Deployment

### Automatic Deployments

✅ **Already configured!** Every push to `main` branch automatically deploys.

### Monitor Deployments

- View deployment logs in Vercel dashboard
- Check function logs for API errors
- Monitor analytics in Vercel dashboard

### Update Environment Variables

1. Go to **Settings** → **Environment Variables**
2. Edit or add variables
3. **Redeploy** for changes to take effect

---

## Need Help?

- Check Vercel logs: Dashboard → Your Project → Deployments → Click deployment → Logs
- Check function logs: Dashboard → Your Project → Functions tab
- Vercel Docs: [vercel.com/docs](https://vercel.com/docs)

---

## Your Deployment URL

After deployment, your site will be available at:
- **Production**: `https://your-project-name.vercel.app`
- **Preview**: `https://your-project-name-git-branch.vercel.app`

🎉 **Congratulations! Your app is now live on Vercel!**



