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
        localStorage.setItem("entrepriseId", data.data.entrepriseId);

        console.log("user id from local storage :",data.data._id );

        console.log("entreprise id from local storage :",data.data.entrepriseId );

        alert("Connexion réussie !");
        navigate("/home"); // 🔹 redirection directe vers home
      } else {
        const errData = await res.json();
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

      <button type="submit" style={{ marginTop: 10 }}>Login</button>

      {/* 🔹 Bouton pour aller à l'inscription */}
      <button
        type="button"
        onClick={() => navigate("/register")}
        style={{ marginTop: 10, marginLeft: 10 }}
      >
        Créer un compte
      </button>
    </form>
  );
}
