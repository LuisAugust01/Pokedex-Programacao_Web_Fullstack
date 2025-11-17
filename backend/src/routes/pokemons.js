import express from 'express';
import fs from 'fs';
import path from 'path';
import axios from 'axios';
import NodeCache from 'node-cache';
import { query, body, validationResult } from 'express-validator';
import { authMiddleware } from './auth.js';
import { PokemonModel } from '../models/PokemonModel.js';

const router = express.Router();
const cache = new NodeCache({ stdTTL: 300, checkperiod: 60 });

const POKEAPI = 'https://pokeapi.co/api/v2';

function mapLocalToRemoteShape(p) {
  return {
    id: p.id,
    name: p.name,
    weight: p.weight ? p.weight * 10 : undefined, // manter unidade próxima da pokeapi se necessário
    height: p.height ? p.height * 10 : undefined,
    types: (p.types || []).map(t => ({ type: { name: t } })),
    abilities: (p.abilities || []).map(a => ({ ability: { name: a } })),
    sprites: {
      front_default: p.image_url || null,
      other: { 'official-artwork': { front_default: p.image_url || null } }
    },
    source: 'local',
    created_by: p.created_by,
    created_at: p.created_at
  };
}

router.get(
  '/pokemons',
  authMiddleware,
  query('query').optional().trim().escape(),
  query('type').optional().trim().escape(),
  query('page').optional().toInt(),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const { query: q, type, page = 1 } = req.query;
    const limit = 20;
    const offset = (page - 1) * limit;

    const cacheKey = `search:${q || ''}:${type || ''}:${page}`;
    const hit = cache.get(cacheKey);
    if (hit) return res.json(hit);

    try {
      let data = [];

      if (q) {
        // resultados locais por nome aproximado
        const local = PokemonModel.findByNameLike(q).map(mapLocalToRemoteShape);
        // tentativa de remoto por nome/ID direto
        let remote = [];
        try {
          const resp = await axios.get(`${POKEAPI}/pokemon/${q}`);
          remote = [resp.data];
        } catch {}
        // merge por nome
        const byName = new Map();
        [...local, ...remote].forEach(item => byName.set(item.name, item));
        data = Array.from(byName.values());
      } else if (type) {
        const resp = await axios.get(`${POKEAPI}/type/${type}`);
        const sliced = resp.data.pokemon.slice(offset, offset + limit).map(p => p.pokemon.url);
        const details = await Promise.all(sliced.map(url => axios.get(url).then(r => r.data)));
        const localAll = PokemonModel.listAll()
          .filter(p => (p.types || []).includes(type))
          .map(mapLocalToRemoteShape);
        data = [...localAll, ...details];
      } else {
        const resp = await axios.get(`${POKEAPI}/pokemon?limit=${limit}&offset=${offset}`);
        const details = await Promise.all(resp.data.results.map(p => axios.get(p.url).then(r => r.data)));
        // incluir inseridos locais na primeira página
        const localAll = page === 1 ? PokemonModel.listAll().map(mapLocalToRemoteShape) : [];
        data = [...localAll, ...details];
      }

      const result = { items: data, page, pageSize: limit };
      try {
        const p = path.join(process.cwd(), 'backend', 'logs', 'app.log');
        fs.appendFileSync(p, `[${new Date().toISOString()}] search user=${req.user?.username} query=${q || ''} type=${type || ''} page=${page}\n`);
      } catch {}
      cache.set(cacheKey, result);
      return res.json(result);
    } catch (e) {
      try {
        const p = path.join(process.cwd(), 'backend', 'logs', 'app.log');
        fs.appendFileSync(p, `[${new Date().toISOString()}] search-error user=${req.user?.username} message=${e.message}\n`);
      } catch {}
      const status = e.response?.status || 500;
      return res.status(status).json({ error: 'Falha na busca de Pokémons' });
    }
  }
);

router.get('/types', authMiddleware, async (req, res) => {
  try {
    const cacheKey = 'types:all';
    const hit = cache.get(cacheKey);
    if (hit) return res.json(hit);
    const resp = await axios.get(`${POKEAPI}/type`);
    const result = { items: resp.data.results };
    cache.set(cacheKey, result);
    return res.json(result);
  } catch (e) {
    return res.status(500).json({ error: 'Falha ao buscar tipos' });
  }
});

router.get('/pokemons/local', authMiddleware, (req, res) => {
  const items = PokemonModel.listAll();
  return res.json({ items });
});

router.post(
  '/pokemons',
  authMiddleware,
  body('name').trim().isLength({ min: 1, max: 50 }).escape(),
  body('types').isArray({ min: 1, max: 3 }),
  body('types.*').isString().trim().escape(),
  body('weight').optional().isFloat({ min: 0 }),
  body('height').optional().isFloat({ min: 0 }),
  body('abilities').optional().isArray({ max: 10 }),
  body('abilities.*').isString().trim().escape(),
  body('imageUrl').optional().isString().isLength({ min: 5 }).trim(),
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const { name, types, weight, height, abilities, imageUrl } = req.body;

    try {
      const inserted = PokemonModel.insert({
        name,
        types,
        weight: weight ?? null,
        height: height ?? null,
        abilities: abilities ?? [],
        image_url: imageUrl ?? null,
        created_by: req.user.id
      });
      cache.flushAll(); // invalidar cache simples após inserção
      try {
        const p = path.join(process.cwd(), 'backend', 'logs', 'app.log');
        fs.appendFileSync(p, `[${new Date().toISOString()}] insert user=${req.user?.username} name=${name}\n`);
      } catch {}
      return res.status(201).json({ id: inserted.id });
    } catch (e) {
      try {
        const p = path.join(process.cwd(), 'backend', 'logs', 'app.log');
        fs.appendFileSync(p, `[${new Date().toISOString()}] insert-error user=${req.user?.username} message=${e.message}\n`);
      } catch {}
      return res.status(500).json({ error: 'Falha ao inserir Pokémon' });
    }
  }
);

// Atualizar Pokémon local (somente do próprio usuário)
router.put(
  '/pokemons/:id',
  authMiddleware,
  body('name').trim().isLength({ min: 1, max: 50 }).escape(),
  body('types').isArray({ min: 1, max: 3 }),
  body('types.*').isString().trim().escape(),
  body('weight').optional().isFloat({ min: 0 }),
  body('height').optional().isFloat({ min: 0 }),
  body('abilities').optional().isArray({ max: 10 }),
  body('abilities.*').isString().trim().escape(),
  body('imageUrl').optional().isString().isLength({ min: 5 }).trim(),
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
    const id = Number(req.params.id);
    const current = PokemonModel.findById(id);
    if (!current) return res.status(404).json({ error: 'Pokémon não encontrado' });
    if (current.created_by !== req.user.id) return res.status(403).json({ error: 'Sem permissão' });
    const { name, types, weight, height, abilities, imageUrl } = req.body;
    const ok = PokemonModel.update(id, {
      name,
      types,
      weight: weight ?? null,
      height: height ?? null,
      abilities: abilities ?? [],
      image_url: imageUrl ?? null
    });
    cache.flushAll();
    return ok ? res.json({ ok: true }) : res.status(500).json({ error: 'Falha ao atualizar' });
  }
);

// Remover Pokémon local (somente do próprio usuário)
router.delete('/pokemons/:id', authMiddleware, (req, res) => {
  const id = Number(req.params.id);
  const current = PokemonModel.findById(id);
  if (!current) return res.status(404).json({ error: 'Pokémon não encontrado' });
  if (current.created_by !== req.user.id) return res.status(403).json({ error: 'Sem permissão' });
  const ok = PokemonModel.remove(id);
  cache.flushAll();
  return ok ? res.json({ ok: true }) : res.status(500).json({ error: 'Falha ao remover' });
});

export default router;
