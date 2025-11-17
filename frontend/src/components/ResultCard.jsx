import React from "react";

export default function ResultCard({ pokemon }) {
  const rawImg =
    pokemon?.sprites?.other?.["official-artwork"]?.front_default ||
    pokemon?.sprites?.front_default ||
    pokemon?.image_url ||
    "https://via.placeholder.com/120x120?text=Pokemon";

  const normalize = (u) => {
    if (!u) return "https://via.placeholder.com/120x120?text=Pokemon";
    if (/^https?:\/\//i.test(u)) return u;
    if (/^\/\//.test(u)) return `https:${u}`;
    return `https://${u}`;
  };

  const img = normalize(rawImg);

  const handleImgError = (e) => {
    e.currentTarget.onerror = null;
    e.currentTarget.src = "https://via.placeholder.com/120x120?text=Pokemon";
  };

  return (
    <div className="result-card">
      <img src={img} alt={pokemon?.name || 'pokemon'} className="pokemon-img" onError={handleImgError} />
      <h3>{pokemon?.name}</h3>
      <p>
        Tipos: { (pokemon?.types || []).map((t) => t.type?.name || t).join(", ") }
      </p>
    </div>
  );
}
