import React from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useAuth } from '../contexts/AuthContext';
import { apiFetch } from '../api';
import { useNavigate } from 'react-router-dom';

const schema = yup.object({
  username: yup.string().required('Informe o usuário').min(3),
  password: yup.string().required('Informe a senha').min(3)
});

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({ resolver: yupResolver(schema) });

  const onSubmit = async (data) => {
    try {
      const resp = await apiFetch('/login', { method: 'POST', body: data });
      login(resp);
      navigate('/');
    } catch (e) {
      alert(e.message);
    }
  };

  return (
    <div className="login-container card">
      <h2>Login</h2>
      <form className="form-vertical" onSubmit={handleSubmit(onSubmit)}>
        <label>Usuário</label>
        <input className="input" placeholder="Usuário" {...register('username')} />
        {errors.username && <p className="error">{errors.username.message}</p>}
        <label>Senha</label>
        <input className="input" placeholder="Senha" type="password" {...register('password')} />
        {errors.password && <p className="error">{errors.password.message}</p>}
        <button className="btn primary" type="submit" disabled={isSubmitting}>Entrar</button>
      </form>
      <p className="hint">Dica: ash/pikachu, misty/togepi, brock/onix</p>
    </div>
  );
}
