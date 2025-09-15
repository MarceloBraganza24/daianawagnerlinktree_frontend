// components/Login.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from 'react-toastify';

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_API_URL;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => null);
        toast(`Alguno de los datos ingresados es incorrecto`, {
            position: "top-right",
            autoClose: 2000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "dark",
            className: "custom-toast",
        });
        return;
      }

      const data = await res.json();
      localStorage.setItem("token", data.token);
      navigate("/admin");
    } catch (err) {
      toast(`Error al conectar con el servidor`, {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
          className: "custom-toast",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="loginContainer">
      <form onSubmit={handleSubmit} className="loginContainer__form">
        <h2 className="loginContainer__form__title">Inicio de sesión</h2>

        <div className="loginContainer__form__inputContainer">
          <input
            className="loginContainer__form__inputContainer__input"
            placeholder="Usuario"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            />
          <input
            type="password"
            className="loginContainer__form__inputContainer__input"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            />
        </div>

        <button
          type="submit"
          className="loginContainer__form__btn"
          disabled={loading}
        >
          {loading ? "Ingresando…" : "Ingresar"}
        </button>
      </form>
    </div>
  );
}
