import React from "react";
import ReactDOM from "react-dom";

import { useAuth } from "../contexts/AuthContext";
import { apiFetch } from "../api";

export default function PokemonModal({ pokemon, onClose, onChanged }) {
  if (!pokemon) return null;
  const { token, user } = useAuth();
  const isLocal = pokemon.source === "local";
  const isOwner = isLocal && user && (pokemon.created_by === user.id);
  const [editing, setEditing] = React.useState(false);
  const [form, setForm] = React.useState(() => ({
    name: pokemon.name || "",
    types: (Array.isArray(pokemon.types) ? pokemon.types.map(t => t?.type?.name || t?.name || String(t)) : []).join(", "),
    weight: typeof pokemon.weight === "number" ? (pokemon.weight/10).toFixed(1) : "",
    height: typeof pokemon.height === "number" ? (pokemon.height/10).toFixed(1) : "",
    abilities: (Array.isArray(pokemon.abilities) ? pokemon.abilities.map(a => a?.ability?.name || a?.name || String(a)) : []).join(", "),
    imageUrl: (pokemon.image_url) || (pokemon.sprites?.other?.["official-artwork"]?.front_default) || (pokemon.sprites?.front_default) || ""
  }));

  const img =
    (pokemon.sprites &&
      pokemon.sprites.other &&
      pokemon.sprites.other["official-artwork"] &&
      pokemon.sprites.other["official-artwork"].front_default) ||
    pokemon.image_url ||
    (pokemon.sprites && pokemon.sprites.front_default) ||
    "https://via.placeholder.com/300x300?text=Pokemon";

  const types = Array.isArray(pokemon.types)
    ? pokemon.types.map((t) => t?.type?.name || t?.name || String(t)).filter(Boolean)
    : [];

  const abilities = Array.isArray(pokemon.abilities)
    ? pokemon.abilities
        .map((a) => a?.ability?.name || a?.name || String(a))
        .filter(Boolean)
    : [];

  const stats = Array.isArray(pokemon.stats) ? pokemon.stats : [];

  const weightKg = typeof pokemon.weight === "number" ? (pokemon.weight / 10).toFixed(1) : "?";
  const heightM = typeof pokemon.height === "number" ? (pokemon.height / 10).toFixed(1) : "?";

  async function saveEdit() {
    try {
      const payload = {
        name: form.name.trim(),
        types: form.types.split(',').map(s=>s.trim()).filter(Boolean),
        weight: form.weight ? Number(form.weight) : null,
        height: form.height ? Number(form.height) : null,
        abilities: form.abilities ? form.abilities.split(',').map(s=>s.trim()).filter(Boolean) : [],
        imageUrl: form.imageUrl || null
      };
      await apiFetch(`/pokemons/${pokemon.id}`, { method: 'PUT', token, body: payload });
      setEditing(false);
      onChanged && onChanged();
      onClose && onClose();
    } catch (e) {
      alert(e.message);
    }
  }

  async function removeItem() {
    if (!confirm('Excluir este Pokémon?')) return;
    try {
      await apiFetch(`/pokemons/${pokemon.id}`, { method: 'DELETE', token });
      onChanged && onChanged();
      onClose && onClose();
    } catch (e) {
      alert(e.message);
    }
  }

  return ReactDOM.createPortal(
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>
          ✖
        </button>
        <h2>{pokemon.name}</h2>
        <img src={img} alt={pokemon.name} className="modal-img" />
        {isLocal && (
          <p><strong>Criado por (id):</strong> {pokemon.created_by ?? '?'}</p>
        )}
        {pokemon.created_at && (
          <p><strong>Criado em:</strong> {new Date(pokemon.created_at).toLocaleString()}</p>
        )}
        <p>
          <strong>Tipos:</strong> {types.length ? types.join(", ") : "?"}
        </p>
        <p>
          <strong>Peso:</strong> {weightKg} kg
        </p>
        <p>
          <strong>Altura:</strong> {heightM} m
        </p>
        <h3>Habilidades</h3>
        {abilities.length ? (
          <ul>
            {abilities.map((name) => (
              <li key={name}>{name}</li>
            ))}
          </ul>
        ) : (
          <p>?</p>
        )}
        {stats.length > 0 && (
          <>
            <h3>Status Base</h3>
            <ul>
              {stats.map((s) => (
                <li key={s.stat?.name || Math.random()}>
                  {s.stat?.name || "stat"}: {s.base_stat ?? "?"}
                </li>
              ))}
            </ul>
          </>
        )}

        {isOwner && (
          <div className="modal-actions">
            {!editing ? (
              <>
                <button onClick={() => setEditing(true)}>Editar</button>
                <button onClick={removeItem} style={{ marginLeft: 8, color: '#b00020' }}>Excluir</button>
              </>
            ) : (
              <div className="edit-form">
                <input value={form.name} onChange={e=>setForm(f=>({...f,name:e.target.value}))} placeholder="Nome" />
                <input value={form.types} onChange={e=>setForm(f=>({...f,types:e.target.value}))} placeholder="Tipos (a,b)" />
                <input value={form.weight} onChange={e=>setForm(f=>({...f,weight:e.target.value}))} placeholder="Peso (kg)" />
                <input value={form.height} onChange={e=>setForm(f=>({...f,height:e.target.value}))} placeholder="Altura (m)" />
                <input value={form.abilities} onChange={e=>setForm(f=>({...f,abilities:e.target.value}))} placeholder="Habilidades (a,b)" />
                <input value={form.imageUrl} onChange={e=>setForm(f=>({...f,imageUrl:e.target.value}))} placeholder="URL da imagem" />
                <div style={{ marginTop: 8 }}>
                  <button onClick={saveEdit}>Salvar</button>
                  <button onClick={()=>setEditing(false)} style={{ marginLeft: 8 }}>Cancelar</button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>,
    document.body
  );
}