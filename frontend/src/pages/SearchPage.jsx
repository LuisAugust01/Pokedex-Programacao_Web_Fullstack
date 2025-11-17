import React from 'react';
import SearchForm from '../components/SearchForm';
import FilterType from '../components/FilterType';
import ResultsList from '../components/ResultsList';
import Pagination from '../components/Pagination';

export default function SearchPage() {
  return (
    <div>
      <SearchForm />
      <FilterType />
      <ResultsList />
      <Pagination />
    </div>
  );
}
