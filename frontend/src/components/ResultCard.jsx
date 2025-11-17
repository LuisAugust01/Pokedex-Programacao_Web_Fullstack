import React from "react";

export default function ResultCard({ pokemon }) {
  const img =
    pokemon?.sprites?.other?.["official-artwork"]?.front_default ||
    pokemon?.sprites?.front_default ||
    pokemon?.image_url ||
    "https://via.placeholder.com/120x120?text=Pokemon";
  return (
    <div className="result-card">
      <img src={img} alt={pokemon.name} className="pokemon-img" />
      <h3>{pokemon.name}</h3>
      <p>
        Tipos:{" "}
        {pokemon.types.map((t) => t.type.name).join(", ")}
      </p>
    </div>
  );
}
