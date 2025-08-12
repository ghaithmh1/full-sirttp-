import React, { useState } from "react";

export default function RegisterForm() {
  const [nom, setNom] = useState("");
  const [prenom, setPrenom] = useState("");
  const [email, setEmail] = useState("");
  const [pwd, setPwd] = useState("");
  const [num, setNum] = useState("");

  const handleSubmit = async (e) => {
  e.preventDefault();

  const payload = { nom, prenom, email, pwd, num };
  console.log("Envoi inscription :", payload);

  try {
    const res1 = await fetch("http://localhost:5000/api/user/checkEmail", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });

    if (res1.ok) {
      console.log("Email utilisé");
      alert("Cet email est déjà utilisé.");
      return; // arrêter la fonction, on ne continue pas l'inscription
    } else if (res1.status === 404) {
      // email non trouvé, on peut continuer l'inscription
      const res2 = await fetch("http://localhost:5000/api/user/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res2.ok) {
        const data = await res2.json();
        console.log("Inscription réussie :", data);
        alert("Inscription réussie !");
        // reset form
        setNom("");
        setPrenom("");
        setEmail("");
        setPwd("");
        setNum("");
      } else {
        const errData = await res2.json();
        console.error("Erreur inscription :", errData.message || res2.statusText);
        alert("Erreur : " + (errData.message || "Une erreur est survenue"));
      }
    } else {
      // autre erreur (ex: 400)
      const errData = await res1.json();
      alert("Erreur : " + (errData.message || "Erreur lors de la vérification de l'email"));
    }
  } catch (error) {
    console.error("Erreur réseau :", error);
    alert("Erreur réseau, merci de réessayer plus tard");
  }
};


  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: 400, margin: "auto" }}>
      <h2>Register</h2>

      <div>
        <label>Nom</label>
        <input
          type="text"
          value={nom}
          onChange={(e) => setNom(e.target.value)}
          required
        />
      </div>

      <div>
        <label>Prénom</label>
        <input
          type="text"
          value={prenom}
          onChange={(e) => setPrenom(e.target.value)}
          required
        />
      </div>

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

      <div>
        <label>Numéro</label>
        <input
          type="text"
          value={num}
          onChange={(e) => setNum(e.target.value)}
          placeholder="Ex: 21234567"
          required
        />
      </div>

      <button type="submit" style={{ marginTop: 10 }}>
        S'inscrire
      </button>
    </form>
  );
}
