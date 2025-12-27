# 🔐 How to Generate SESSION_SECRET

## Method 1: Using the Helper Script (Easiest)

```bash
node generate-secret.js
```

This will output a secure 64-character hexadecimal string that you can copy and use.

---

## Method 2: Using Node.js Command Line

```bash
node -e "import('crypto').then(c => console.log(c.default.randomBytes(32).toString('hex')))"
```

Or if you have Node.js with CommonJS:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

---

## Method 3: Using OpenSSL (Mac/Linux)

```bash
openssl rand -hex 32
```

---

## Method 4: Using Python

```bash
python3 -c "import secrets; print(secrets.token_hex(32))"
```

---

## Method 5: Online Generator

You can also use an online random string generator:
- Make sure it generates at least 32 bytes (64 hex characters)
- Use a trusted source

---

## What to Do With the Secret

1. **Copy the generated secret** (64-character hex string)
2. **Go to Vercel Dashboard** → Your Project → Settings → Environment Variables
3. **Add new variable:**
   - Name: `SESSION_SECRET`
   - Value: (paste your generated secret)
   - Environment: Select all (Production, Preview, Development)
4. **Save** and **Redeploy**

---

## Example Output

```
🔐 Generated SESSION_SECRET:
f91b674a14561b23f65d653f006b09da19b37c542110dd5314e718c3f936c062
```

**Important:** 
- Keep this secret secure
- Don't commit it to GitHub
- Use different secrets for different environments (optional but recommended)
- Minimum length: 32 bytes (64 hex characters)

---

## Why Do You Need SESSION_SECRET?

The `SESSION_SECRET` is used to encrypt session cookies for your Express app. It ensures that:
- User sessions are secure
- Session data cannot be tampered with
- Admin authentication works properly

**Never use the default secret in production!**

