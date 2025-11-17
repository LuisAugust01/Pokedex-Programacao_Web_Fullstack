import fs from 'fs';
import http from 'http';
import https from 'https';
import path from 'path';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';

import authRouter from './routes/auth.js';
import pokemonsRouter from './routes/pokemons.js';
import { initDb } from './config/db.js';

dotenv.config();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

const FRONTEND_ORIGIN = process.env.FRONTEND_ORIGIN || 'http://localhost:5173';
const FRONTEND_ORIGINS = (process.env.FRONTEND_ORIGINS || `${FRONTEND_ORIGIN},http://localhost:5174`) 
  .split(',')
  .map(o => o.trim())
  .filter(Boolean);

app.use(helmet());
app.use(cors({ origin: FRONTEND_ORIGINS, credentials: false }));
app.use(compression());
app.use(express.json({ limit: '200kb' }));
app.use(express.urlencoded({ extended: false }));

// Logs
const logsDir = path.join(__dirname, '..', 'logs');
if (!fs.existsSync(logsDir)) fs.mkdirSync(logsDir, { recursive: true });
const accessLogStream = fs.createWriteStream(path.join(logsDir, 'access.log'), { flags: 'a' });
app.use(morgan('combined', { stream: accessLogStream }));

// Rate limiting básico
const limiter = rateLimit({ windowMs: 60 * 1000, max: 120 });
app.use(limiter);

// Rotas
app.get('/api/health', (req, res) => res.json({ ok: true }));
app.use('/api', authRouter);
app.use('/api', pokemonsRouter);

// Inicializa DB e servidor
const PORT = Number(process.env.PORT || 3001);
const USE_HTTPS = process.env.HTTPS === 'true';

initDb();

if (USE_HTTPS) {
  const keyPath = process.env.SSL_KEY;
  const certPath = process.env.SSL_CERT;
  if (keyPath && certPath && fs.existsSync(keyPath) && fs.existsSync(certPath)) {
    const options = { key: fs.readFileSync(keyPath), cert: fs.readFileSync(certPath) };
    https.createServer(options, app).listen(PORT, () => {
      console.log(`HTTPS server running on https://localhost:${PORT}`);
    });
  } else {
    console.warn('HTTPS enabled but SSL files missing. Falling back to HTTP.');
    http.createServer(app).listen(PORT, () => console.log(`HTTP server on http://localhost:${PORT}`));
  }
} else {
  http.createServer(app).listen(PORT, () => console.log(`HTTP server on http://localhost:${PORT}`));
}
