import React from "react";
import { Link } from "react-router-dom";

export default function ProjetsSidebar() {
  return (
    <div className="sidebar">
      <ul>
        <li><Link to="/projets/liste">📁 Liste des Projets</Link></li>
        <li><Link to="/projets/creer">➕ Créer un Projet</Link></li>
        <li><Link to="/projets/statistiques">📈 Statistiques</Link></li>
      </ul>
    </div>
  );
}
