import React from 'react';
import { SearchProvider } from './contexts/SearchContext';
import SearchForm from './components/SearchForm';
import ResultsList from './components/ResultsList';

export default function App() {
  return (
    <SearchProvider>
      <div style={{ maxWidth: 900, margin: '16px auto', padding: 16 }}>
        <h1>Projeto SPA - Exemplo</h1>
        <SearchForm />
        <hr />
        <ResultsList />
      </div>
    </SearchProvider>
  );
}