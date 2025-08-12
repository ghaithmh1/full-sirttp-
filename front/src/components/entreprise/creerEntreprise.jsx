import React, { useState, useEffect } from "react";
import axios from "axios";

export default function CreateEntreprise() {
  const [identifiantFiscal, setIdentifiantFiscal] = useState("");
  const [nom, setNom] = useState("");
  const [adresse, setAdresse] = useState("");
  const [ville, setVille] = useState("");
  const [codePostal, setCodePostal] = useState("");
  const [telephone, setTelephone] = useState("");
  const [email, setEmail] = useState("");
  const [secteurActivite, setSecteurActivite] = useState("");
  const [dateCreation, setDateCreation] = useState("");
  const [description, setDescription] = useState("");
  const [taille, setTaille] = useState("");
  const [createdBy, setCreatedBy] = useState("");
  const [message, setMessage] = useState("");

  // Récupérer l'ID utilisateur depuis localStorage
  useEffect(() => {
    const userId = localStorage.getItem("userId");
    if (userId) {
      setCreatedBy(userId);
      console.log(userId);
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post("http://localhost:5000/api/entreprise/create", {
        identifiantFiscal,
        nom,
        adresse,
        ville,
        codePostal,
        telephone,
        email,
        secteurActivite,
        dateCreation,
        description,
        taille,
        createdBy
      });

      setMessage(res.data.message);

      // Réinitialisation des champs
      setIdentifiantFiscal("");
      setNom("");
      setAdresse("");
      setVille("");
      setCodePostal("");
      setTelephone("");
      setEmail("");
      setSecteurActivite("");
      setDateCreation("");
      setDescription("");
      setTaille("");
    } catch (err) {
      if (err.response) {
        setMessage(err.response.data.message);
      } else {
        setMessage("Erreur serveur");
      }
    }
  };

  return (
    <div style={{ maxWidth: "500px", margin: "auto" }}>
      <h2>Créer une entreprise</h2>
      {message && (
        <p style={{ color: message.includes("succès") ? "green" : "red" }}>
          {message}
        </p>
      )}
      <form onSubmit={handleSubmit}>
        <input placeholder="Identifiant Fiscal" value={identifiantFiscal} onChange={(e) => setIdentifiantFiscal(e.target.value)} />
        <input placeholder="Nom" value={nom} onChange={(e) => setNom(e.target.value)} />
        <input placeholder="Adresse" value={adresse} onChange={(e) => setAdresse(e.target.value)} />
        <input placeholder="Ville" value={ville} onChange={(e) => setVille(e.target.value)} />
        <input placeholder="Code Postal" value={codePostal} onChange={(e) => setCodePostal(e.target.value)} />
        <input placeholder="Téléphone" value={telephone} onChange={(e) => setTelephone(e.target.value)} />
        <input placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <input placeholder="Secteur d'activité" value={secteurActivite} onChange={(e) => setSecteurActivite(e.target.value)} />
        <input type="date" value={dateCreation} onChange={(e) => setDateCreation(e.target.value)} />
        <textarea placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} />
        <input placeholder="Taille" value={taille} onChange={(e) => setTaille(e.target.value)} />

        

        <button type="submit">Créer</button>
      </form>
    </div>
  );
}
