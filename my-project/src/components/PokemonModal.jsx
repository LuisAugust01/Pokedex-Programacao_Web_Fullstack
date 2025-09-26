import React from "react";
import ReactDOM from "react-dom";

export default function PokemonModal({ pokemon, onClose }) {
  if (!pokemon) return null;

  return ReactDOM.createPortal(
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>
          ✖
        </button>
        <h2>{pokemon.name}</h2>
        <img
          src={pokemon.sprites.other["official-artwork"].front_default}
          alt={pokemon.name}
          className="modal-img"
        />
        <p>
          <strong>Tipos:</strong>{" "}
          {pokemon.types.map((t) => t.type.name).join(", ")}
        </p>
        <p>
          <strong>Peso:</strong> {pokemon.weight / 10} kg
        </p>
        <p>
          <strong>Altura:</strong> {pokemon.height / 10} m
        </p>
        <h3>Habilidades</h3>
        <ul>
          {pokemon.abilities.map((a) => (
            <li key={a.ability.name}>{a.ability.name}</li>
          ))}
        </ul>
        <h3>Status Base</h3>
        <ul>
          {pokemon.stats.map((s) => (
            <li key={s.stat.name}>
              {s.stat.name}: {s.base_stat}
            </li>
          ))}
        </ul>
      </div>
    </div>,
    document.body
  );
}