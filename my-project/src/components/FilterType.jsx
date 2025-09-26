import React, { useContext, useEffect, useState } from "react";
import { SearchContext } from "../contexts/SearchContext";

export default function FilterType() {
  const { state, dispatch } = useContext(SearchContext);
  const [types, setTypes] = useState([]);

  useEffect(() => {
    async function fetchTypes() {
      try {
        const res = await fetch("https://pokeapi.co/api/v2/type");
        if (!res.ok) throw new Error("Erro ao buscar tipos!");
        const data = await res.json();
        setTypes(data.results);
      } catch (err) {
        console.error("Erro ao carregar tipos:", err);
      }
    }
    fetchTypes();
  }, []);

  const handleChange = (e) => {
    dispatch({ type: "SET_TYPE_FILTER", payload: e.target.value });
    dispatch({ type: "SET_QUERY", payload: "" });
    dispatch({ type: "SET_PAGE", payload: 1 });
  };

  return (
    <div className="filter-type">
      <label htmlFor="filterType">Filtrar por tipo: </label>
      <select
        id="filterType"
        value={state.filterType}
        onChange={handleChange}
      >
        <option value="">Todos</option>
        {types.map((type) => (
          <option key={type.name} value={type.name}>
            {type.name}
          </option>
        ))}
      </select>
    </div>
  );
}