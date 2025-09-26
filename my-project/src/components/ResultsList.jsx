import React, { useContext, useEffect, useState } from "react";
import { SearchContext } from "../contexts/SearchContext";
import ResultCard from "./ResultCard";
import PokemonModal from "./PokemonModal";

export default function ResultsList() {
  const { state, dispatch } = useContext(SearchContext);
  const { query, filterType, page, pokemons, loading, error } = state;
  const [selectedPokemon, setSelectedPokemon] = useState(null);

  const limit = 20;
  const offset = (page - 1) * limit;

  async function fetchPokemons() {
    try {
      dispatch({ type: "SET_LOADING" });

      if (query) {
        const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${query}`);
        if (!res.ok) throw new Error("Pokémon não encontrado!");
        const data = await res.json();
        dispatch({ type: "SET_RESULTS", payload: [data] });
        return;
      }

      if (filterType) {
        const res = await fetch(`https://pokeapi.co/api/v2/type/${filterType}`);
        if (!res.ok) throw new Error("Erro ao buscar por tipo!");
        const data = await res.json();

        const sliced = data.pokemon
          .slice(offset, offset + limit)
          .map((p) => p.pokemon);

        const details = await Promise.all(
          sliced.map((p) => fetch(p.url).then((r) => r.json()))
        );

        dispatch({ type: "SET_RESULTS", payload: details });
        return;
      }

      const res = await fetch(
        `https://pokeapi.co/api/v2/pokemon?limit=${limit}&offset=${offset}`
      );
      if (!res.ok) throw new Error("Erro ao buscar lista de Pokémons!");
      const data = await res.json();

      const details = await Promise.all(
        data.results.map((p) => fetch(p.url).then((r) => r.json()))
      );

      dispatch({ type: "SET_RESULTS", payload: details });
    } catch (err) {
      dispatch({ type: "SET_ERROR", payload: err.message });
    }
  }

  useEffect(() => {
    fetchPokemons();
  }, [query, filterType, page]);

  if (loading) return <p>Carregando...</p>;
  if (error) return <p className="error">{error}</p>;

  return (
    <div className="results-list">
      {pokemons.map((p) => (
        <div key={p.id} onClick={() => setSelectedPokemon(p)}>
          <ResultCard pokemon={p} />
        </div>
      ))}

      {selectedPokemon && (
        <PokemonModal
          pokemon={selectedPokemon}
          onClose={() => setSelectedPokemon(null)}
        />
      )}
    </div>
  );
}