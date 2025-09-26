import React, { createContext, useReducer } from "react";

const initialState = {
  query: "",        
  pokemons: [],     
  page: 1,          
  filterType: "",   
  loading: false,   
  error: null       
};

function searchReducer(state, action) {
  switch (action.type) {
    case "SET_QUERY":
      return { ...state, query: action.payload };
    case "SET_RESULTS":
      return { ...state, pokemons: action.payload, loading: false, error: null };
    case "SET_PAGE":
      return { ...state, page: action.payload };
    case "SET_TYPE_FILTER":
      return { ...state, filterType: action.payload };
    case "SET_LOADING":
      return { ...state, loading: true, error: null };
    case "SET_ERROR":
      return { ...state, error: action.payload, loading: false };
    default:
      return state;
  }
}

export const SearchContext = createContext();

export function SearchProvider({ children }) {
  const [state, dispatch] = useReducer(searchReducer, initialState);

  return (
    <SearchContext.Provider value={{ state, dispatch }}>
      {children}
    </SearchContext.Provider>
  );
}
