import React, { useContext, useEffect, useState } from "react";
import { SearchContext } from "../contexts/SearchContext";
import { useAuth } from "../contexts/AuthContext";
import { apiFetch } from "../api";
import ResultCard from "./ResultCard";
import PokemonModal from "./PokemonModal";

export default function ResultsList() {
  const { state, dispatch } = useContext(SearchContext);
  const { token } = useAuth();
  const { query, filterType, page, pokemons, loading, error } = state;
  const [selectedPokemon, setSelectedPokemon] = useState(null);

  const limit = 20;
  const offset = (page - 1) * limit;

  async function fetchPokemons() {
    try {
      dispatch({ type: "SET_LOADING" });
      const params = new URLSearchParams();
      if (query) params.set("query", query);
      if (filterType) params.set("type", filterType);
      params.set("page", String(page));
      const data = await apiFetch(`/pokemons?${params.toString()}`, { token });
      dispatch({ type: "SET_RESULTS", payload: data.items || [] });
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
        <div
          key={`${p.source || 'remote'}-${p.id ?? p.name}`}
          onClick={() => setSelectedPokemon(p)}
        >
          <ResultCard pokemon={p} />
        </div>
      ))}

      {selectedPokemon && (
        <PokemonModal
          pokemon={selectedPokemon}
          onClose={() => setSelectedPokemon(null)}
          onChanged={() => fetchPokemons()}
        />
      )}
    </div>
  );
}