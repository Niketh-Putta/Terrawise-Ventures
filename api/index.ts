import express, { type Request, Response, NextFunction } from "express";
import session from "express-session";
import { registerRoutes } from "../server/routes";
import { serveStatic } from "../server/vite";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Session configuration for Vercel
// Using a simple memory store for serverless (sessions won't persist across invocations)
// For production, consider using Vercel KV or another external session store
app.use(session({
  secret: process.env.SESSION_SECRET || 'terrawise-admin-secret-key-change-in-production',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production', // Use secure cookies in production
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
    httpOnly: true,
    sameSite: 'lax' as const,
  }
}));

app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }

      console.log(logLine);
    }
  });

  next();
});

// Error handler
app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
  const status = err.status || err.statusCode || 500;
  const message = err.message || "Internal Server Error";

  res.status(status).json({ message });
});

// Initialize routes and export handler
let handlerInitialized = false;
let appHandler: any = null;

async function initializeApp() {
  if (handlerInitialized) {
    return appHandler;
  }

  // Register routes (we don't need the HTTP server in serverless)
  await registerRoutes(app);
  
  // Note: Static files are served by Vercel directly, not through the API handler
  // Only serve static files if we're NOT on Vercel (e.g., local production testing)
  if ((process.env.NODE_ENV === 'production') && !process.env.VERCEL) {
    serveStatic(app);
  }

  handlerInitialized = true;
  appHandler = app;
  return appHandler;
}

// Vercel serverless function handler
// Vercel passes (req, res) in Node.js http format which Express can handle
export default async function handler(req: any, res: any) {
  const appInstance = await initializeApp();
  return appInstance(req, res);
}

