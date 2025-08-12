import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

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
  const [users, setUsers] = useState(""); // un seul userId (string)
  const [message, setMessage] = useState("");

  const navigate = useNavigate();

  // Récupérer l'ID utilisateur depuis localStorage au chargement
  useEffect(() => {
    const userId = localStorage.getItem("userId");
    if (userId) {
      setUsers(userId);
      console.log("UserId récupéré :", userId);
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
        users
      });

      setMessage(res.data.message);

      if (res.data.entreprise && res.data.entreprise._id) {
        localStorage.setItem("entrepriseId", res.data.entreprise._id);
        console.log("Entreprise ID sauvegardé :", res.data.entreprise._id);

        // Redirection vers la page home
        navigate("/home");
      }

      // Réinitialiser les champs du formulaire
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
      if (err.response && err.response.data.message) {
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
        <input
          required
          placeholder="Identifiant Fiscal"
          value={identifiantFiscal}
          onChange={(e) => setIdentifiantFiscal(e.target.value)}
        />
        <input
          required
          placeholder="Nom"
          value={nom}
          onChange={(e) => setNom(e.target.value)}
        />
        <input
          required
          placeholder="Adresse"
          value={adresse}
          onChange={(e) => setAdresse(e.target.value)}
        />
        <input
          required
          placeholder="Ville"
          value={ville}
          onChange={(e) => setVille(e.target.value)}
        />
        <input
          placeholder="Code Postal"
          value={codePostal}
          onChange={(e) => setCodePostal(e.target.value)}
        />
        <input
          required
          placeholder="Téléphone"
          value={telephone}
          onChange={(e) => setTelephone(e.target.value)}
        />
        <input
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          placeholder="Secteur d'activité"
          value={secteurActivite}
          onChange={(e) => setSecteurActivite(e.target.value)}
        />
        <input
          type="date"
          value={dateCreation}
          onChange={(e) => setDateCreation(e.target.value)}
        />
        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <input
          placeholder="Taille"
          value={taille}
          onChange={(e) => setTaille(e.target.value)}
        />

        <button type="submit">Créer</button>
      </form>
    </div>
  );
}
