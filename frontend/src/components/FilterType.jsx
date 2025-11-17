import React, { useContext, useEffect, useState } from "react";
import { SearchContext } from "../contexts/SearchContext";
import { useAuth } from "../contexts/AuthContext";
import { apiFetch } from "../api";

export default function FilterType() {
  const { state, dispatch } = useContext(SearchContext);
  const { token } = useAuth();
  const [types, setTypes] = useState([]);

  useEffect(() => {
    async function fetchTypes() {
      try {
        const data = await apiFetch('/types', { token });
        setTypes(data.items || []);
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