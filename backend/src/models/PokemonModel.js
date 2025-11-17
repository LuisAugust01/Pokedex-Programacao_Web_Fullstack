import { getDb } from '../config/db.js';

export class PokemonModel {
  static insert({ name, types, weight, height, abilities, image_url, created_by }) {
    const db = getDb();
    const stmt = db.prepare(
      'INSERT INTO pokemons (name, types, weight, height, abilities, image_url, created_by) VALUES (?, ?, ?, ?, ?, ?, ?)'
    );
    const info = stmt.run(
      name,
      JSON.stringify(types || []),
      weight ?? null,
      height ?? null,
      JSON.stringify(abilities || []),
      image_url ?? null,
      created_by ?? null
    );
    return { id: info.lastInsertRowid };
  }

  static listAll() {
    const db = getDb();
    const rows = db.prepare('SELECT * FROM pokemons ORDER BY created_at DESC').all();
    return rows.map(r => ({
      ...r,
      types: JSON.parse(r.types || '[]'),
      abilities: JSON.parse(r.abilities || '[]')
    }));
  }

  static findByNameLike(q) {
    const db = getDb();
    const rows = db.prepare('SELECT * FROM pokemons WHERE LOWER(name) LIKE LOWER(?) ORDER BY created_at DESC').all(`%${q}%`);
    return rows.map(r => ({
      ...r,
      types: JSON.parse(r.types || '[]'),
      abilities: JSON.parse(r.abilities || '[]')
    }));
  }

  static findById(id) {
    const db = getDb();
    const r = db.prepare('SELECT * FROM pokemons WHERE id = ?').get(id);
    if (!r) return null;
    return {
      ...r,
      types: JSON.parse(r.types || '[]'),
      abilities: JSON.parse(r.abilities || '[]')
    };
  }

  static update(id, { name, types, weight, height, abilities, image_url }) {
    const db = getDb();
    const stmt = db.prepare(
      'UPDATE pokemons SET name = ?, types = ?, weight = ?, height = ?, abilities = ?, image_url = ? WHERE id = ?'
    );
    const info = stmt.run(
      name,
      JSON.stringify(types || []),
      weight ?? null,
      height ?? null,
      JSON.stringify(abilities || []),
      image_url ?? null,
      id
    );
    return info.changes > 0;
  }

  static remove(id) {
    const db = getDb();
    const info = db.prepare('DELETE FROM pokemons WHERE id = ?').run(id);
    return info.changes > 0;
  }
}
