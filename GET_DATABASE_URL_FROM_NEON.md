# 🔗 Get Your DATABASE_URL from Neon

## Step-by-Step Instructions

### Step 1: Reveal the Password

In the Neon modal you're looking at:

1. **Click "Show password"** button (below the connection string)
2. The password will be revealed (no longer masked with `****`)

### Step 2: Copy the Connection String

1. **Click "Copy snippet"** button
   - OR manually select and copy the entire connection string
2. It will look like:
   ```
   postgresql://neondb_owner:YOUR_PASSWORD@ep-wispy-butterfly-abdqiiee-pooler.eu-west-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require
   ```

### Step 3: Remove channel_binding for Vercel

**Important:** Remove `&channel_binding=require` from the end!

**Before (with channel_binding):**
```
postgresql://neondb_owner:password@ep-wispy-butterfly-abdqiiee-pooler.eu-west-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require
```

**After (for Vercel):**
```
postgresql://neondb_owner:password@ep-wispy-butterfly-abdqiiee-pooler.eu-west-2.aws.neon.tech/neondb?sslmode=require
```

### Step 4: Add to Vercel

1. Go to **Vercel Dashboard** → Your Project
2. **Settings** → **Environment Variables**
3. Find or edit `DATABASE_URL`
4. **Paste** the connection string (without `&channel_binding=require`)
5. **Save**
6. **Redeploy**

---

## Quick Checklist

- [ ] Clicked "Show password" in Neon
- [ ] Copied the full connection string
- [ ] Removed `&channel_binding=require` from the end
- [ ] Added to Vercel as `DATABASE_URL`
- [ ] Saved in Vercel
- [ ] Redeployed

---

## Your Connection String Format

Based on what I can see, your connection string should be:

```
postgresql://neondb_owner:YOUR_PASSWORD@ep-wispy-butterfly-abdqiiee-pooler.eu-west-2.aws.neon.tech/neondb?sslmode=require
```

**Replace `YOUR_PASSWORD`** with the actual password (click "Show password" to see it).

---

## Why Remove channel_binding?

The `&channel_binding=require` parameter can cause issues with serverless environments like Vercel. Removing it ensures compatibility.

---

## After Adding to Vercel

1. **Save** the environment variable
2. **Redeploy** your project
3. **Check build logs** to ensure it works
4. **Test your site**

---

🎯 **Action: Click "Show password", copy the connection string, remove `&channel_binding=require`, and add to Vercel!**



