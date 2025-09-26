import React from "react";
import { SearchProvider } from "./contexts/SearchContext";
import SearchForm from "./components/SearchForm";
import ResultsList from "./components/ResultsList";
import FilterType from "./components/FilterType";
import Pagination from "./components/Pagination";
import "./styles.css";

export default function App() {
  return (
    <SearchProvider>
      <div className="app-container">
        <h1>Pokédex</h1>
        <SearchForm />
        <FilterType />
        <ResultsList />
        <Pagination />
      </div>
    </SearchProvider>
  );
}