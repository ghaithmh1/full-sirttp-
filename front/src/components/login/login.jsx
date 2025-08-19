import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css"; // Import du fichier CSS

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [pwd, setPwd] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const payload = { email, pwd };
    console.log("Envoi login :", payload);

    try {
      const res = await fetch("http://localhost:5000/api/users/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        const data = await res.json();
        console.log("Connexion réussie :", data);

        localStorage.setItem("token", data.data.token);
        localStorage.setItem("userId", data.data._id);

        navigate("/home");
      } else {
        const errData = await res.json();
        setError(errData.message || "Une erreur est survenue");
      }
    } catch (error) {
      setError("Erreur réseau, merci de réessayer plus tard");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="login-form">
      <h2>Login</h2>

      {error && <p className="error-message">{error}</p>}

      <div className="form-group">
        <label>Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>

      <div className="form-group">
        <label>Mot de passe</label>
        <input
          type="password"
          value={pwd}
          onChange={(e) => setPwd(e.target.value)}
          required
        />
      </div>

      <div className="button-group">
        <button type="submit" className="submit-button">Login</button>
        <button
          type="button"
          onClick={() => navigate("/register")}
          className="secondary-button"
        >
          Créer un compte
        </button>
      </div>
    </form>
  );
}