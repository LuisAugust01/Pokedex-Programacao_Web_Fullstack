# Front-end (Projeto 2)

SPA em React + Vite consumindo o backend Express. Rotas: Login, Busca (PokéAPI via backend) e Inserção.

## Executar
1) Configurar a URL da API (dev):
```
VITE_API_BASE_URL=http://localhost:3001/api
```
Crie o arquivo `.env.local` com a variável acima.

2) Rodar
```
npm install
npm run dev
```

## Dependências relevantes
- react-router-dom (rotas)
- react-hook-form + yup (validação)
- Context API (AuthContext, SearchContext)
