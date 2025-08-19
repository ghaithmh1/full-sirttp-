import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./creerEntreprise.css";

export default function CreateEntreprise() {
  const [formData, setFormData] = useState({
    identifiantFiscal: "",
    nom: "",
    adresse: "",
    ville: "",
    codePostal: "",
    telephone: "",
    email: "",
    secteurActivite: "",
    dateCreation: "",
    description: "",
    taille: ""
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const creatorId = localStorage.getItem("userId");

    if (!creatorId) {
      alert("Utilisateur non connecté !");
      return;
    }

    const payload = {
      ...formData,
      creatorId,
      users: [creatorId]
    };

    try {
      const res = await axios.post(
        "http://localhost:5000/api/entreprises/create",
        payload
      );

      if (res.data.success && res.data.data._id) {
        localStorage.setItem("entrepriseId", res.data.data._id);
        alert("Entreprise créée avec succès !");
        navigate("/home");
      }
    } catch (err) {
      if (err.response?.data?.message) {
        alert(err.response.data.message);
      } else {
        alert("Erreur serveur");
      }
    }
  };

  return (
    <div className="create-entreprise-container">
      <h2>Créer une entreprise</h2>
      <form onSubmit={handleSubmit} className="entreprise-form">
        <div className="form-grid">
          <input
            name="identifiantFiscal"
            required
            placeholder="Identifiant Fiscal"
            value={formData.identifiantFiscal}
            onChange={handleChange}
          />
          <input
            name="nom"
            required
            placeholder="Nom"
            value={formData.nom}
            onChange={handleChange}
          />
          <input
            name="adresse"
            required
            placeholder="Adresse"
            value={formData.adresse}
            onChange={handleChange}
          />
          <input
            name="ville"
            required
            placeholder="Ville"
            value={formData.ville}
            onChange={handleChange}
          />
          <input
            name="codePostal"
            placeholder="Code Postal"
            value={formData.codePostal}
            onChange={handleChange}
          />
          <input
            name="telephone"
            required
            placeholder="Téléphone"
            value={formData.telephone}
            onChange={handleChange}
          />
          <input
            name="email"
            type="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
          />
          <input
            name="secteurActivite"
            placeholder="Secteur d'activité"
            value={formData.secteurActivite}
            onChange={handleChange}
          />
          <input
            name="dateCreation"
            type="date"
            value={formData.dateCreation}
            onChange={handleChange}
          />
          <input
            name="taille"
            placeholder="Taille"
            value={formData.taille}
            onChange={handleChange}
          />
        </div>
        <textarea
          name="description"
          placeholder="Description"
          value={formData.description}
          onChange={handleChange}
          className="description-field"
        />
        <button type="submit" className="submit-btn">Créer</button>
      </form>
    </div>
  );
}