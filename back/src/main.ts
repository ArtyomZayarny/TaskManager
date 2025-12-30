import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { ExpressAdapter } from "@nestjs/platform-express";

const allowedOrigins = [
  'http://localhost:3000',
  'https://trello-clone-tau-sage.vercel.app',
  process.env.CLIENT_URL,
].filter(Boolean);

let cachedApp: any;

export async function createApp() {
  if (cachedApp) {
    return cachedApp;
  }

  const express = require('express');
  const server = express();
  const app = await NestFactory.create(AppModule, new ExpressAdapter(server));

  // Handle preflight EARLY (BEFORE guards/controllers can block it)
  app.use((req, res, next) => {
    if (req.method === 'OPTIONS') {
      const origin = req.headers.origin;
      if (origin && allowedOrigins.includes(origin)) {
        res.header('Access-Control-Allow-Origin', origin);
      }
      res.header('Vary', 'Origin');
      res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
      res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Accept, Origin, X-Requested-With');
      res.header('Access-Control-Allow-Credentials', 'true');
      return res.sendStatus(204);
    }
    next();
  });

  // Main CORS config
  app.enableCors({
    origin: (origin, callback) => {
      if (!origin) {
        return callback(null, true);
      }
      
      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        console.log(`CORS: Blocked origin: ${origin}`);
        callback(new Error(`CORS blocked for origin: ${origin}`), false);
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: [
      'Content-Type',
      'Authorization',
      'Accept',
      'Origin',
      'X-Requested-With',
    ],
    exposedHeaders: ['Authorization'],
    preflightContinue: false,
    optionsSuccessStatus: 204,
  });

  app.setGlobalPrefix("api");

  await app.init();
  cachedApp = server;
  return server;
}

// For local development
if (!process.env.VERCEL) {
  (async () => {
    const app = await createApp();
    app.listen(process.env.PORT || 3001, () => {
      console.log(`Server is running on port ${process.env.PORT || 3001}`);
    });
  })();
}
