import React from "react";

export default function ResultCard({ pokemon }) {
  return (
    <div className="result-card">
      <img
        src={pokemon.sprites.front_default}
        alt={pokemon.name}
        className="pokemon-img"
      />
      <h3>{pokemon.name}</h3>
      <p>
        Tipos:{" "}
        {pokemon.types.map((t) => t.type.name).join(", ")}
      </p>
    </div>
  );
}
