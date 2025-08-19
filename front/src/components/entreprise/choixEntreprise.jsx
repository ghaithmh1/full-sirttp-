import React from "react";
import { useNavigate } from "react-router-dom";

export default function ChoixEntreprise() {
  const navigate = useNavigate();

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h2>Bienvenue !</h2>
      <p>Souhaitez-vous créer une nouvelle entreprise ou rejoindre une entreprise existante ?</p>

      <button 
        style={{ margin: "10px", padding: "10px 20px" }}
        onClick={() => navigate("/entreprise")}
      >
        Créer une entreprise
      </button>

      <button 
        style={{ margin: "10px", padding: "10px 20px" }}
        onClick={() => navigate("/joindreEntreprise")}
      >
        Joindre une entreprise
      </button>
    </div>
  );
}
