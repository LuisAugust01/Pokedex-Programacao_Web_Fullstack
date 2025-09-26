# Pokédex - Projeto Programação Web Fullstack
Este projeto é uma SPA (Single Page Application) desenvolvida em React.js utilizando Vite.
O objetivo é consumir dados da PokéAPI e apresentar uma Pokédex interativa com busca, filtros e paginação.

---

## ⚙️ Tecnologias Utilizadas
React.js + Vite,
React Hook Form + Yup (validação),
Context API + useReducer (gerenciamento de estado global),
PokéAPI (API pública utilizada),

---

## 🏗️ Estrutura do Projeto
 ```
src/
├── components/ # Componentes React (UI)
│   ├── SearchForm.jsx
│   ├── ResultsList.jsx
│   ├── ResultCard.jsx
│   ├── FilterType.jsx
│   ├── Pagination.jsx
│   └── PokemonModal.jsx
├── contexts/ # Context API + useReducer
│   └── SearchContext.jsx
├── App.jsx # Composição da aplicação
├── main.jsx # Entrada principal do React
└── styles.css # Estilos globais
```
## ⚡ Funcionalidades
- 🔍 **Buscar Pokémon** por nome ou ID  
- 🎭 **Filtrar por tipo** (ex: fogo, água, planta)  
- 📑 **Paginação** para navegar entre páginas de resultados  
- 📝 **Validação de formulário** com mensagens de erro  
- 🖼️ **Modal de detalhes** ao clicar em um Pokémon  
- 🌐 SPA com carregamento dinâmico de dados  

---

## 🛠️ Como rodar o projeto

### 1. Clonar o repositório
"```bash"
git clone https://github.com/SEU_USUARIO/pokedex.git
cd pokedex

2. Instalar dependências
npm install

3. Rodar em modo desenvolvimento
npm run dev

Acesse: http://localhost:5173

4. Gerar build de produção
npm run build

5. Servir o build localmente
npm install -g serve
serve -s dist
