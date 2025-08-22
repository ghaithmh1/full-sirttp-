// StockSidebar.jsx
import React from "react";
import "./StockSidebar.scss";

export default function StockSidebar({ onSelect, selected }) {
  return (
    <div className="sidebar">
      <ul>
        <li
          style={{ fontWeight: selected === "produits" ? "bold" : "normal" }}
          onClick={() => onSelect("produits")}
        >
          📦 Produits
        </li>
        <li
          style={{ fontWeight: selected === "ajouter" ? "bold" : "normal" }}
          onClick={() => onSelect("ajouter")}
        >
          ➕ Ajouter Produit
        </li>
      </ul>
    </div>
  );
}
