import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let db;

export function getDb() {
  if (!db) throw new Error('DB not initialized');
  return db;
}

export function initDb() {
  const dbPath = path.join(__dirname, '..', '..', 'database.sqlite');
  db = new Database(dbPath);
  db.pragma('journal_mode = WAL');

  db.prepare(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`).run();

  db.prepare(`CREATE TABLE IF NOT EXISTS pokemons (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    types TEXT NOT NULL, -- JSON array
    weight REAL,
    height REAL,
    image_url TEXT,
    abilities TEXT, -- JSON array
    created_by INTEGER,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (created_by) REFERENCES users(id)
  )`).run();

  // Migração leve: garantir coluna image_url
  try {
    const cols = db.prepare("PRAGMA table_info(pokemons)").all();
    const hasImage = cols.some(c => c.name === 'image_url');
    if (!hasImage) {
      db.prepare('ALTER TABLE pokemons ADD COLUMN image_url TEXT').run();
    }
  } catch {}
}
