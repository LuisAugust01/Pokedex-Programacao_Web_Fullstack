import express from 'express';
import fs from 'fs';
import path from 'path';
import { body, validationResult } from 'express-validator';
import jwt from 'jsonwebtoken';
import { UserModel } from '../models/UserModel.js';

const router = express.Router();

// In-memory blacklist para invalidação simples de tokens
const tokenBlacklist = new Set();

function isBlacklisted(token) {
  return tokenBlacklist.has(token);
}

export function authMiddleware(req, res, next) {
  const auth = req.headers.authorization || '';
  const token = auth.startsWith('Bearer ') ? auth.slice(7) : null;
  if (!token) return res.status(401).json({ error: 'Token ausente' });
  if (isBlacklisted(token)) return res.status(401).json({ error: 'Token inválido' });
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET || 'devsecret');
    req.user = payload;
    return next();
  } catch (e) {
    return res.status(401).json({ error: 'Token inválido' });
  }
}

router.post(
  '/login',
  body('username').trim().isLength({ min: 3, max: 30 }).escape(),
  body('password').isLength({ min: 3, max: 100 }),
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const { username, password } = req.body;
    const user = UserModel.findByUsername(username);
    if (!user || !UserModel.verifyPassword(user, password)) {
      try {
        const p = path.join(process.cwd(), 'backend', 'logs', 'app.log');
        fs.appendFileSync(p, `[${new Date().toISOString()}] auth-fail username=${username}\n`);
      } catch {}
      return res.status(401).json({ error: 'Credenciais inválidas' });
    }
    const payload = { id: user.id, username: user.username };
    const token = jwt.sign(payload, process.env.JWT_SECRET || 'devsecret', { expiresIn: '2h' });
    try {
      const p = path.join(process.cwd(), 'backend', 'logs', 'app.log');
      fs.appendFileSync(p, `[${new Date().toISOString()}] auth-success user=${user.username}\n`);
    } catch {}
    return res.json({ token, user: payload });
  }
);

router.post('/logout', (req, res) => {
  const auth = req.headers.authorization || '';
  const token = auth.startsWith('Bearer ') ? auth.slice(7) : null;
  if (token) tokenBlacklist.add(token);
  return res.json({ ok: true });
});

// Seed inicial de usuários se necessário
router.post('/seed-users', (req, res) => {
  try {
    if (!UserModel.findByUsername('ash')) UserModel.create('ash', 'pikachu');
    if (!UserModel.findByUsername('misty')) UserModel.create('misty', 'togepi');
    if (!UserModel.findByUsername('brock')) UserModel.create('brock', 'onix');
    return res.json({ ok: true });
  } catch (e) {
    return res.status(500).json({ error: 'Falha ao semear usuários' });
  }
});

export default router;
