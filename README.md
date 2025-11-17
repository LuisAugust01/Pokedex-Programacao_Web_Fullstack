# Projeto 2 – Pokédex (Fullstack)

Aplicação web em 3 camadas: Front-end (React SPA), Back-end HTTP (Express.js REST) e Banco de Dados (SQLite). Implementa Login, Busca e Inserção com requisitos de segurança, cache e compressão.

## Estrutura do Repositório
```
Pokedex-Programacao_Web_Fullstack/
├─ backend/
│  ├─ src/
│  │  ├─ config/       # db, etc.
│  │  ├─ models/       # acesso ao banco
│  │  └─ routes/       # rotas + controladores
│  └─ package.json
└─ frontend/           # Front-end (estrutura do Projeto 1 preservada)
	├─ src/
	└─ package.json
```

## Requisitos implementados
- Login com JWT (apenas logado acessa busca e inserção)
- Busca de Pokémons via backend (proxy para PokéAPI com cache)
- Inserção de Pokémons (armazenamento local no banco)
- Validações no servidor (express-validator) e no cliente (Yup)
- Segurança: Helmet, rate limit, hashing de senha (bcrypt), invalidação simples de token, logs de autenticação/busca/post
- Otimizações: compressão de respostas (compression), cache no backend (NodeCache)

## Como rodar (Windows PowerShell)

1) Backend
```powershell
cd "c:\Users\USER\Documents\GitHub\Pokedex-Programacao_Web_Fullstack\backend"
npm install
$env:JWT_SECRET = "devsecret"; $env:PORT = "3001"; npm run dev
```
Opcional (semente inicial de usuários):
```powershell
Invoke-RestMethod -Method Post -Uri http://localhost:3001/api/seed-users
```

2) Frontend
```powershell
cd "c:\Users\USER\Documents\GitHub\Pokedex-Programacao_Web_Fullstack\frontend"
npm install
"VITE_API_BASE_URL=http://localhost:3001/api" | Out-File -FilePath .env.local -Encoding utf8
npm run dev
```
Acesse: `http://localhost:5173` e faça login (ex.: `ash/pikachu`).

## Endpoints principais (REST)
- `POST /api/login` → autenticação (retorna token)
- `POST /api/logout` → invalida token atual
- `GET /api/pokemons?query=&type=&page=` → busca (autenticado)
- `GET /api/types` → tipos (autenticado)
- `POST /api/pokemons` → inserir Pokémon (autenticado)
- `GET /api/pokemons/local` → itens inseridos localmente (autenticado)

## Notas de segurança
- HTTPS opcional via variáveis `HTTPS=true`, `SSL_KEY`, `SSL_CERT` (ambiente local)
- Rate limit básico habilitado
- Sanitização/validação de parâmetros no servidor
- Hash de senhas no banco (bcrypt)
- Logs em `backend/logs/`