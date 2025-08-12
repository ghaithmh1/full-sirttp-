import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [pwd, setPwd] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = { email, pwd };
    console.log("Envoi login :", payload);

    try {
      const res = await fetch("http://localhost:5000/api/user/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        const data = await res.json();
        console.log("Connexion réussie :", data);

        alert("Connexion réussie !");
        
        // Stocker le token et l'ID utilisateur
        localStorage.setItem("token", data.token);
        localStorage.setItem("userId", data._id);

        // Redirection sans mettre l'id dans l'URL
        navigate("/entreprise");
      } else {
        const errData = await res.json();
        console.error("Erreur login :", errData.message || res.statusText);
        alert("Erreur : " + (errData.message || "Une erreur est survenue"));
      }
    } catch (error) {
      console.error("Erreur réseau :", error);
      alert("Erreur réseau, merci de réessayer plus tard");
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: 400, margin: "auto" }}>
      <h2>Login</h2>

      <div>
        <label>Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>

      <div>
        <label>Mot de passe</label>
        <input
          type="password"
          value={pwd}
          onChange={(e) => setPwd(e.target.value)}
          required
        />
      </div>

      <button type="submit" style={{ marginTop: 10 }}>
        Login
      </button>
    </form>
  );
}
