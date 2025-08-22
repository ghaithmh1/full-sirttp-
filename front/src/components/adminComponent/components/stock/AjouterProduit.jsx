import React from "react";
import "./AjouterProduit.scss";

export default function AjouterProduit() {
  return (
    <div className="AjouterProduit">
      <h2>➕ Ajouter un Produit</h2>
      <p>Formulaire pour ajouter un nouveau produit.</p>

      {/* Exemple de formulaire */}
      <form>
        <label>Nom du produit</label>
        <input type="text" placeholder="Entrez le nom du produit" />

        <label>Quantité</label>
        <input type="number" placeholder="Quantité en stock" />

        <button type="submit">Ajouter</button>
      </form>
    </div>
  );
}
