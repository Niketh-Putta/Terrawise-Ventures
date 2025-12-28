# ⚡ Quick Deploy to Vercel - 5 Minutes

## 🎯 Fast Track (If you're in a hurry)

### 1. Go to Vercel
👉 [vercel.com/new](https://vercel.com/new)

### 2. Import GitHub Repo
- Click **"Continue with GitHub"**
- Select **`Terrawise-Ventures`** repository
- Click **"Import"**

### 3. Add Environment Variables
Click **"Environment Variables"** and add:

**REQUIRED:**
```
DATABASE_URL=your-neon-database-connection-string
SESSION_SECRET=run-node-generate-secret.js-to-generate
```

**OPTIONAL (for full features):**
```
EMAIL_HOST=imap.gmail.com
EMAIL_PORT=993
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
FAST2SMS_API_KEY=your-sms-api-key
```

### 4. Deploy!
- Click **"Deploy"**
- Wait 1-2 minutes
- ✅ Done! Your site is live!

---

## 🔑 Generate SESSION_SECRET

Run this in your terminal:
```bash
node generate-secret.js
```

Copy the output and paste it as `SESSION_SECRET` in Vercel.

---

## 📍 Your Site URL

After deployment:
- **Production**: `https://terrawise-ventures.vercel.app` (or similar)
- Check Vercel dashboard for exact URL

---

## ✅ Verify It Works

1. Visit your Vercel URL
2. Check homepage loads
3. Test a form submission
4. Check API: `https://your-url.vercel.app/api/projects`

---

## 🆘 Quick Fixes

**Build fails?**
- Check `DATABASE_URL` is set
- Check build logs in Vercel dashboard

**API not working?**
- Check function logs in Vercel
- Verify `api/index.ts` exists

**Database connection error?**
- Verify `DATABASE_URL` format
- Check database allows external connections

---

## 📚 Full Guide

See `VERCEL_DEPLOY_STEPS.md` for detailed instructions.



