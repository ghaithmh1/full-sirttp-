import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Register.css"; // Import du fichier CSS

export default function RegisterForm() {
  const [nom, setNom] = useState("");
  const [prenom, setPrenom] = useState("");
  const [email, setEmail] = useState("");
  const [pwd, setPwd] = useState("");
  const [num, setNum] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const payload = { nom, prenom, email, pwd, num };

    try {
      const res1 = await fetch("http://localhost:5000/api/users/checkEmail", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (res1.ok) {
        setError("Cet email est déjà utilisé.");
        return;
      } else if (res1.status !== 404) {
        setError("Erreur lors de la vérification de l'email");
        return;
      }

      const res2 = await fetch("http://localhost:5000/api/users/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res2.ok) {
        const data = await res2.json();
        localStorage.setItem("userId", data.data._id);
        localStorage.setItem("token", data.data.token);
        navigate("/ChoixEntreprise");
      } else {
        const errData = await res2.json();
        setError(errData.message || "Une erreur est survenue lors de l'inscription");
      }
    } catch (err) {
      setError("Erreur réseau, merci de réessayer plus tard");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="register-form">
      <h2>Register</h2>

      {error && <p className="error-message">{error}</p>}

      <input 
        type="text" 
        placeholder="Nom" 
        value={nom} 
        onChange={(e) => setNom(e.target.value)} 
        required 
      />
      <input 
        type="text" 
        placeholder="Prénom" 
        value={prenom} 
        onChange={(e) => setPrenom(e.target.value)} 
        required 
      />
      <input 
        type="email" 
        placeholder="Email" 
        value={email} 
        onChange={(e) => setEmail(e.target.value)} 
        required 
      />
      <input 
        type="password" 
        placeholder="Mot de passe" 
        value={pwd} 
        onChange={(e) => setPwd(e.target.value)} 
        required 
      />
      <input 
        type="text" 
        placeholder="Numéro" 
        value={num} 
        onChange={(e) => setNum(e.target.value)} 
        required 
      />

      <button type="submit" className="submit-button">S'inscrire</button>
    </form>
  );
}