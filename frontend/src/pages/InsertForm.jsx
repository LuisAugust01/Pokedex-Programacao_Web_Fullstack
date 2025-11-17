import React from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useAuth } from '../contexts/AuthContext';
import { apiFetch } from '../api';

const schema = yup.object({
  name: yup.string().required().max(50),
  types: yup.string().required('Informe ao menos um tipo (separe por vírgulas)'),
  weight: yup.number().nullable().transform(v => (Number.isNaN(v) ? null : v)).min(0),
  height: yup.number().nullable().transform(v => (Number.isNaN(v) ? null : v)).min(0),
  abilities: yup.string().nullable(),
  imageUrl: yup.string().url('Informe uma URL válida').nullable().transform(v => (v === '' ? null : v))
});

export default function InsertForm() {
  const { token } = useAuth();
  const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm({ resolver: yupResolver(schema) });

  const onSubmit = async (data) => {
    const payload = {
      name: data.name.trim(),
      types: data.types.split(',').map(s => s.trim()).filter(Boolean),
      weight: data.weight ?? null,
      height: data.height ?? null,
      abilities: (data.abilities || '').split(',').map(s => s.trim()).filter(Boolean),
      imageUrl: data.imageUrl ?? null
    };
    try {
      await apiFetch('/pokemons', { method: 'POST', token, body: payload });
      alert('Pokémon inserido!');
      reset();
    } catch (e) {
      alert(e.message);
    }
  };

  return (
    <div className="insert-container card">
      <h2>Inserir Pokémon</h2>
      <form className="form-vertical" onSubmit={handleSubmit(onSubmit)}>
        <label>Nome</label>
        <input className="input" placeholder="Nome" {...register('name')} />
        {errors.name && <p className="error">{errors.name.message}</p>}
        <label>Tipos (ex: fire, flying)</label>
        <input className="input" placeholder="Tipos (ex: fire, flying)" {...register('types')} />
        {errors.types && <p className="error">{errors.types.message}</p>}
        <div className="row">
          <div className="col">
            <label>Peso (kg)</label>
            <input className="input" placeholder="Peso (kg)" type="number" step="0.1" {...register('weight')} />
            {errors.weight && <p className="error">{errors.weight.message}</p>}
          </div>
          <div className="col">
            <label>Altura (m)</label>
            <input className="input" placeholder="Altura (m)" type="number" step="0.1" {...register('height')} />
            {errors.height && <p className="error">{errors.height.message}</p>}
          </div>
        </div>
        <label>Habilidades (ex: overgrow, chlorophyll)</label>
        <input className="input" placeholder="Habilidades (ex: overgrow, chlorophyll)" {...register('abilities')} />
        {errors.abilities && <p className="error">{errors.abilities.message}</p>}
        <label>URL da imagem (opcional)</label>
        <input className="input" placeholder="URL da imagem (opcional)" {...register('imageUrl')} />
        {errors.imageUrl && <p className="error">{errors.imageUrl.message}</p>}
        <button className="btn primary" type="submit" disabled={isSubmitting}>Salvar</button>
      </form>
    </div>
  );
}
