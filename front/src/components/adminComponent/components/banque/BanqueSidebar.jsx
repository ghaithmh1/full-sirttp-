import React from "react";
import { Link } from "react-router-dom";

export default function BanqueSidebar() {
  return (
    <div className="sidebar">
      <ul>
        <li><Link to="/banque/liste">📊 Vue d’ensemble</Link></li>
        <li><Link to="/banque/ajouter">➕ Ajouter Transaction</Link></li>
        <li><Link to="/banque/historique">📑 Historique</Link></li>
      </ul>
    </div>
  );
}
