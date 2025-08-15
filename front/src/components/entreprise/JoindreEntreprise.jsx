import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function JoindreEntreprise() {
  const [identifiantFiscal, setIdentifiantFiscal] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleJoin = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("token"); // JWT from login
      if (!token) {
        setMessage("Vous devez être connecté");
        return;
      }

      const res = await axios.post(
        "http://localhost:5000/api/entreprises/join",
        { identifiantFiscal },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setMessage(res.data.message);

      if (res.data.success) {
        // Redirection après succès
        navigate("/home");
      }
    } catch (err) {
      setMessage(err.response?.data?.message || "Erreur serveur");
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: "auto" }}>
      <h2>Joindre une entreprise</h2>
      {message && (
        <p style={{ color: message.includes("succès") ? "green" : "red" }}>
          {message}
        </p>
      )}

      <form onSubmit={handleJoin}>
        <input
          type="text"
          placeholder="Identifiant Fiscal"
          value={identifiantFiscal}
          onChange={(e) => setIdentifiantFiscal(e.target.value)}
          required
        />
        <button type="submit" style={{ marginTop: 10 }}>
          Rejoindre
        </button>
      </form>
    </div>
  );
}
