import bcrypt from 'bcryptjs';
import { getDb } from '../config/db.js';

export class UserModel {
  static findByUsername(username) {
    const db = getDb();
    return db.prepare('SELECT * FROM users WHERE username = ?').get(username);
  }

  static create(username, password) {
    const db = getDb();
    const hash = bcrypt.hashSync(password, 10);
    const info = db.prepare('INSERT INTO users (username, password_hash) VALUES (?, ?)').run(username, hash);
    return { id: info.lastInsertRowid, username };
  }

  static verifyPassword(user, password) {
    return bcrypt.compareSync(password, user.password_hash);
  }
}
