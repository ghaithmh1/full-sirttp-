import React, { useState, useEffect } from "react";

export default function ProduitManager() {
  const [produits, setProduits] = useState([]);
  const [form, setForm] = useState({
    nom: "",
    quantite: "",
    unite: "",
    prixUnitaire: "",
    description: ""
  });
  const [editId, setEditId] = useState(null);
  const API_URL = "http://localhost:5000/api/produits";

  // Fetch produits
  async function fetchProduits() {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(API_URL, {
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`, // ✅ Fixed: added backticks
        },
      });
      const data = await res.json();
      console.log("Fetched data:", data);
      setProduits(data.success ? data.data || [] : []);
    } catch (error) {
      console.error("Fetch error:", error);
      setProduits([]);
    }
  }

  useEffect(() => {
    fetchProduits();
  }, []);

  // Handle form submission for Add or Edit
  async function handleSubmit(e) {
    e.preventDefault();
    console.log("handleSubmit triggered", form);
    
    try {
      const method = editId ? "PUT" : "POST";
      const url = editId ? `${API_URL}/${editId}` : API_URL; // ✅ Fixed: added backticks
      
      await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("token")}`, // ✅ Fixed: added backticks
        },
        body: JSON.stringify(form),
      });
      
      // ✅ Fixed: reset with correct field names
      setForm({ 
        nom: "", 
        quantite: "", 
        unite: "", 
        prixUnitaire: "", 
        description: "" 
      });
      setEditId(null);
      fetchProduits();
    } catch (error) {
      console.error("Submit error:", error);
    }
  }

  // Prepare form for editing
  function handleEdit(produit) {
    setEditId(produit._id);
    setForm({
      nom: produit.nom || "",
      quantite: produit.quantite || "",
      unite: produit.unite || "",
      prixUnitaire: produit.prixUnitaire || "",
      description: produit.description || "",
    });
  }

  // Delete a produit
  async function handleDelete(id) {
    try {
      await fetch(`${API_URL}/${id}`, { // ✅ Fixed: added backticks
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${localStorage.getItem("token")}`, // ✅ Fixed: added backticks
        },
      });
      fetchProduits();
    } catch (error) {
      console.error("Delete error:", error);
    }
  }

  return (
    <div style={{ maxWidth: "900px", margin: "auto", padding: "1rem" }}>
      <h2>{editId ? "Modifier Produit" : "Ajouter Produit"}</h2>
      
      <form
        onSubmit={handleSubmit}
        style={{
          marginBottom: "1.5rem",
          display: "flex",
          gap: "1rem",
          flexWrap: "wrap",
        }}
      >
        <input
          placeholder="Nom"
          value={form.nom}
          onChange={(e) => setForm({ ...form, nom: e.target.value })}
          required
          style={{ flex: "1 1 200px", padding: "0.5rem" }}
        />
        <input
          type="number"
          placeholder="Quantité"
          value={form.quantite}
          onChange={(e) => setForm({ ...form, quantite: Number(e.target.value) })}
          required
          style={{ flex: "1 1 120px", padding: "0.5rem" }}
        />
        <input
          placeholder="Unité"
          value={form.unite}
          onChange={(e) => setForm({ ...form, unite: e.target.value })}
          required
          style={{ flex: "1 1 100px", padding: "0.5rem" }}
        />
        <input
          type="number"
          placeholder="Prix Unitaire"
          value={form.prixUnitaire}
          onChange={(e) => setForm({ ...form, prixUnitaire: Number(e.target.value) })}
          required
          style={{ flex: "1 1 150px", padding: "0.5rem" }}
        />
        <input
          placeholder="Description"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          style={{ flex: "1 1 250px", padding: "0.5rem" }}
        />
        
        <div style={{ display: "flex", gap: "0.5rem" }}>
          <button type="submit" style={{ padding: "0.5rem 1rem" }}>
            {editId ? "Mettre à jour" : "Ajouter"}
          </button>
          {editId && (
            <button
              type="button"
              onClick={() => {
                setEditId(null);
                // ✅ Fixed: consistent field names and types
                setForm({
                  nom: "",
                  quantite: "",
                  unite: "",
                  prixUnitaire: "",
                  description: ""
                });
              }}
              style={{ padding: "0.5rem 1rem" }}
            >
              Annuler
            </button>
          )}
        </div>
      </form>

      <h2>Produits</h2>
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr style={{ borderBottom: "2px solid #ccc" }}>
            <th style={{ padding: "0.5rem" }}>Nom</th>
            <th style={{ padding: "0.5rem" }}>Quantité</th>
            <th style={{ padding: "0.5rem" }}>Unité</th>
            <th style={{ padding: "0.5rem" }}>Prix Unitaire</th>
            <th style={{ padding: "0.5rem" }}>Description</th>
            <th style={{ padding: "0.5rem", textAlign: "center" }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {produits.length === 0 ? (
            <tr>
              <td colSpan="6" style={{ padding: "1rem", textAlign: "center" }}>
                Aucun produit trouvé.
              </td>
            </tr>
          ) : (
            produits.map((produit) => (
              <tr key={produit._id} style={{ borderBottom: "1px solid #eee" }}>
                <td style={{ padding: "0.5rem" }}>{produit.nom}</td>
                <td style={{ padding: "0.5rem" }}>{produit.quantite}</td>
                <td style={{ padding: "0.5rem" }}>{produit.unite}</td>
                <td style={{ padding: "0.5rem" }}>{produit.prixUnitaire}</td>
                <td style={{ padding: "0.5rem" }}>{produit.description}</td>
                <td style={{ padding: "0.5rem", textAlign: "center" }}>
                  <button
                    onClick={() => handleEdit(produit)}
                    style={{ marginRight: "0.5rem" }}
                  >
                    Modifier
                  </button>
                  <button
                    onClick={() => handleDelete(produit._id)}
                    style={{ color: "red" }}
                  >
                    Supprimer
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}