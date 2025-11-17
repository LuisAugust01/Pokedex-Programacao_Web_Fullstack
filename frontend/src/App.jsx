import React from "react";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import { SearchProvider } from "./contexts/SearchContext";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import SearchPage from "./pages/SearchPage";
import InsertForm from "./pages/InsertForm";
import Login from "./pages/Login";
import "./styles.css";

export default function App() {
  return (
    <AuthProvider>
      <SearchProvider>
        <BrowserRouter>
          <div className="app-container">
            <Header />
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route
                path="/"
                element={
                  <ProtectedRoute>
                    <SearchPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/insert"
                element={
                  <ProtectedRoute>
                    <InsertForm />
                  </ProtectedRoute>
                }
              />
            </Routes>
          </div>
        </BrowserRouter>
      </SearchProvider>
    </AuthProvider>
  );
}

function Header() {
  const { token, user, logout } = useAuth();
  return (
    <div className="header">
      <h1>Pokédex</h1>
      <nav>
        {token && (
          <>
            <Link to="/">Busca</Link>
            <Link to="/insert">Inserir</Link>
          </>
        )}
        {!token && <Link to="/login">Login</Link>}
      </nav>
      {token && (
        <div className="user-box">
          <span>{user?.username}</span>
          <button onClick={logout}>Sair</button>
        </div>
      )}
    </div>
  );
}