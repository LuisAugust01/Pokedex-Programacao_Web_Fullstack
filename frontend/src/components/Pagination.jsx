import React, { useContext } from "react";
import { SearchContext } from "../contexts/SearchContext";

export default function Pagination() {
  const { state, dispatch } = useContext(SearchContext);
  const { page, pokemons } = state;

  const handlePrev = () => {
    if (page > 1) {
      dispatch({ type: "SET_PAGE", payload: page - 1 });
    }
  };

  const handleNext = () => {
    if (pokemons.length > 0) {
      dispatch({ type: "SET_PAGE", payload: page + 1 });
    }
  };

  return (
    <div className="pagination">
      <button onClick={handlePrev} disabled={page === 1}>
        ← Anterior
      </button>
      <span>Página {page}</span>
      <button onClick={handleNext} disabled={pokemons.length === 0}>
        Próxima →
      </button>
    </div>
  );
}