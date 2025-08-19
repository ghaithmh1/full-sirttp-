import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./JoindreEntreprise.css";

export default function JoindreEntreprise() {
  const [identifiantFiscal, setIdentifiantFiscal] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  const userId = localStorage.getItem("userId");

  const handleJoin = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      if (!token) return setMessage("Vous devez être connecté");

      const res = await axios.post(
        "http://localhost:5000/api/entreprises/join",
        { identifiantFiscal },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setMessage(res.data.message);

      if (res.data.success) {
        navigate("/home");
      }
    } catch (err) {
      setMessage(err.response?.data?.message || "Erreur serveur");
    }
  };

  return (
    <div className="join-entreprise-container">
      <h2>Joindre une entreprise</h2>
      {message && (
        <p className={`message ${message.includes("succès") ? "success" : "error"}`}>
          {message}
        </p>
      )}

      <form onSubmit={handleJoin} className="join-form">
        <input
          type="text"
          placeholder="Identifiant Fiscal"
          value={identifiantFiscal}
          onChange={(e) => setIdentifiantFiscal(e.target.value)}
          required
          className="form-input"
        />
        <button type="submit" className="submit-button">
          Rejoindre
        </button>
      </form>
    </div>
  );
}