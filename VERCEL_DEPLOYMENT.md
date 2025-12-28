# Vercel Deployment Guide

This project has been configured for deployment on Vercel.

## Prerequisites

1. A Vercel account
2. Your GitHub repository connected to Vercel
3. Environment variables configured in Vercel dashboard

## Environment Variables

Make sure to set the following environment variables in your Vercel project settings:

- `DATABASE_URL` - Your Neon database connection string
- `SESSION_SECRET` - A secure random string for session encryption
- `EMAIL_HOST` (optional) - Email server host for email monitoring
- `EMAIL_PORT` (optional) - Email server port
- `EMAIL_USER` (optional) - Email username
- `EMAIL_PASSWORD` (optional) - Email password
- `TWILIO_ACCOUNT_SID` (optional) - Twilio account SID for SMS
- `TWILIO_AUTH_TOKEN` (optional) - Twilio auth token
- `TWILIO_PHONE_NUMBER` (optional) - Twilio phone number

## Deployment Steps

1. **Connect Repository**: Link your GitHub repository to Vercel
2. **Configure Project**: Vercel should auto-detect the settings from `vercel.json`
3. **Set Environment Variables**: Add all required environment variables in Vercel dashboard
4. **Deploy**: Push to your main branch or manually trigger deployment

## Build Configuration

- **Build Command**: `npm run build`
- **Output Directory**: `dist/public`
- **Node Version**: 20.x (configured in vercel.json)

## Important Notes

1. **Sessions**: Sessions use in-memory storage by default. For production with persistent sessions, consider using Vercel KV or another external session store.

2. **Email Monitoring**: The email monitoring service is automatically disabled in serverless environments (Vercel). If you need email monitoring, consider using Vercel Cron Jobs or an external service.

3. **Static Files**: Static files are served from `dist/public` after the build process.

4. **API Routes**: All API routes are handled by the Express app in `api/index.ts` as a serverless function.

## Troubleshooting

- If you encounter build errors, check that all dependencies are in `package.json`
- Ensure `DATABASE_URL` is correctly set
- Check Vercel function logs for runtime errors
- Verify that the build output directory exists after build



