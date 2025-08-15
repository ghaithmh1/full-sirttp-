import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import ChoixEntreprise from "../entreprise/choixEntreprise";

export default function RegisterForm() {
  const [nom, setNom] = useState("");
  const [prenom, setPrenom] = useState("");
  const [email, setEmail] = useState("");
  const [pwd, setPwd] = useState("");
  const [num, setNum] = useState("");
  const [showChoix, setShowChoix] = useState(false); // 🔹 État pour afficher la modale
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = { nom, prenom, email, pwd, num };

    try {
      const res1 = await fetch("http://localhost:5000/api/users/checkEmail", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (res1.ok) {
        alert("Cet email est déjà utilisé.");
        return;
      } else if (res1.status === 404) {
        const res2 = await fetch("http://localhost:5000/api/users/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        if (res2.ok) {
          const data = await res2.json();
          alert("Inscription réussie !");
          localStorage.setItem("userId", data._id);

          console.log("Setting showChoix to true");
          setShowChoix(true);
          navigate("/ChoixEntreprise");

        } else {
          const errData = await res2.json();
          alert("Erreur : " + (errData.message || "Une erreur est survenue"));
        }
      } else {
        alert("Erreur lors de la vérification de l'email");
      }
    } catch (error) {
      alert("Erreur réseau, merci de réessayer plus tard");
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit} style={{ maxWidth: 400, margin: "auto" }}>
        <h2>Register</h2>

        <input type="text" placeholder="Nom" value={nom} onChange={(e) => setNom(e.target.value)} required />
        <input type="text" placeholder="Prénom" value={prenom} onChange={(e) => setPrenom(e.target.value)} required />
        <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <input type="password" placeholder="Mot de passe" value={pwd} onChange={(e) => setPwd(e.target.value)} required />
        <input type="text" placeholder="Numéro" value={num} onChange={(e) => setNum(e.target.value)} required />

        <button type="submit" style={{ marginTop: 10 }}>S'inscrire</button>
      </form>

      {/* 🔹 Affichage de la modale si inscription réussie */}
    </>
  );
}
