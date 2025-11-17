import React, { useContext } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { SearchContext } from "../contexts/SearchContext";

const schema = yup.object({
  query: yup
    .string()
    .required("Digite um nome ou ID de Pokémon")
    .matches(/^[a-zA-Z0-9]+$/, "Somente letras e números são permitidos")
});

export default function SearchForm() {
  const { dispatch } = useContext(SearchContext);

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm({
    resolver: yupResolver(schema)
  });

  const onSubmit = (data) => {
    dispatch({ type: "SET_QUERY", payload: data.query.toLowerCase() });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="search-form">
      <input
        type="text"
        placeholder="Buscar Pokémon..."
        {...register("query")}
      />
      <button type="submit">Buscar</button>
      {errors.query && <p className="error">{errors.query.message}</p>}
    </form>
  );
}