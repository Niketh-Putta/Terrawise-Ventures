# 🔗 How to Get Your DATABASE_URL from Neon

## Step 1: Access Neon Dashboard

**Direct Link:** [console.neon.tech](https://console.neon.tech)

1. Go to: **https://console.neon.tech**
2. **Sign in** with your account (GitHub, Google, or email)
3. If you don't have an account, click **"Sign Up"** (it's free)

---

## Step 2: Find Your Project

1. Once logged in, you'll see your **projects** list
2. **Click on your project** (or create a new one if you don't have one)

---

## Step 3: Get Connection String

### Method 1: From Project Dashboard

1. In your project dashboard, look for **"Connection Details"** or **"Connection String"**
2. You'll see a section with connection information
3. Look for **"Connection string"** or **"Connection URI"**
4. It will look like:
   ```
   postgresql://username:password@ep-xxxxx.region.aws.neon.tech/database?sslmode=require
   ```
5. **Click the copy icon** 📋 to copy the full connection string

### Method 2: From Database Settings

1. Click on your **database name** in the sidebar
2. Go to **"Connection Details"** or **"Settings"**
3. Find the **"Connection String"** section
4. **Copy the connection string**

### Method 3: From Connection String Tab

1. In your project, look for a **"Connection String"** tab or section
2. You may see options like:
   - **Pooled connection** (recommended for serverless)
   - **Direct connection**
3. **Copy the pooled connection string** (better for Vercel)

---

## Step 4: What the Connection String Looks Like

Your connection string should be in this format:

```
postgresql://[user]:[password]@[host]/[database]?sslmode=require
```

Example:
```
postgresql://neondb_owner:npg_abc123xyz@ep-cool-darkness-123456.us-east-2.aws.neon.tech/neondb?sslmode=require
```

---

## Step 5: Add to Vercel

1. **Copy the entire connection string**
2. Go back to **Vercel** → Your Project → Settings → Environment Variables
3. **Edit** your `DATABASE_URL` variable
4. **Paste** the connection string in the "Value" field
5. **Save**

---

## Don't Have a Neon Database Yet?

### Create a Free Neon Database:

1. Go to [console.neon.tech](https://console.neon.tech)
2. Click **"Sign Up"** (free)
3. Click **"Create Project"**
4. Choose:
   - **Project name**: `terrawise-ventures` (or any name)
   - **Region**: Choose closest to you
   - **PostgreSQL version**: Latest (default)
5. Click **"Create Project"**
6. Wait 1-2 minutes for database to be created
7. Follow **Step 3** above to get your connection string

---

## Important Notes

- ✅ **Keep your connection string secret** - don't commit it to GitHub
- ✅ **Use pooled connection** for serverless (Vercel)
- ✅ **Connection string includes password** - treat it as sensitive
- ✅ **Format should include `?sslmode=require`** for secure connections

---

## Troubleshooting

### Can't Find Connection String?
- Look for **"Connection Details"** or **"Settings"** in your project
- Check the **"Connection"** or **"Connect"** tab
- Some Neon interfaces show it in the project overview

### Connection String Not Working?
- Make sure it includes `?sslmode=require` at the end
- Verify the password is correct
- Check that your database is active (not paused)

### Need Help?
- Neon Docs: [neon.tech/docs](https://neon.tech/docs)
- Neon Support: Available in the dashboard

---

## Quick Links

- 🌐 **Neon Dashboard**: [console.neon.tech](https://console.neon.tech)
- 📚 **Neon Docs**: [neon.tech/docs](https://neon.tech/docs)
- 💬 **Neon Support**: Available in dashboard

