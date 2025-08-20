import React, { useState, useEffect } from "react";

export default function BonCommandeManager() {
  const [bonCommandes, setBonCommandes] = useState([]);
  const [fournisseurs, setFournisseurs] = useState([]);
  const [clients, setClients] = useState([]);
  const [produits, setProduits] = useState([]);
  const [debugInfo, setDebugInfo] = useState({});

  const [form, setForm] = useState({
    numeroCommande: "",
    dateCommande: "",
    typeBonCommande: "achat", // ✅ Default to "achat"
    listeProduits: [],
    statut: "En attente",
    fournisseur: "",
    client: "",
    description: "",
  });

  const [editId, setEditId] = useState(null);

  const API_URL = "http://localhost:5000/api/bonCommandes";
  const API_FOURNISSEURS = "http://localhost:5000/api/fournisseurs";
  const API_CLIENTS = "http://localhost:5000/api/clients";
  const API_PRODUITS = "http://localhost:5000/api/produits";

  // Fetch all data
  async function fetchBonCommandes() {
    console.log("🚀 Starting fetchBonCommandes...");
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(API_URL, {
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
      });
      
      const data = await res.json();
      console.log("📦 BonCommandes response:", data);
      
      if (data.success && Array.isArray(data.data)) {
        setBonCommandes(data.data);
      } else {
        setBonCommandes([]);
      }
    } catch (error) {
      console.error("💥 Fetch bonCommandes error:", error);
      setBonCommandes([]);
    }
  }

  async function fetchFournisseurs() {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(API_FOURNISSEURS, {
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
      });
      const data = await res.json();
      setFournisseurs(data.data || data);
    } catch (error) {
      console.error("💥 Fetch fournisseurs error:", error);
      setFournisseurs([]);
    }
  }

  async function fetchClients() {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(API_CLIENTS, {
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
      });
      const data = await res.json();
      setClients(data.data || data);
    } catch (error) {
      console.error("💥 Fetch clients error:", error);
      setClients([]);
    }
  }

  async function fetchProduits() {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(API_PRODUITS, {
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
      });
      const data = await res.json();
      setProduits(data.data || data);
    } catch (error) {
      console.error("💥 Fetch produits error:", error);
      setProduits([]);
    }
  }

  useEffect(() => {
    fetchBonCommandes();
    fetchFournisseurs();
    fetchClients();
    fetchProduits();
  }, []);

  // ✅ CRITICAL: Handle type change and reset related fields
  function handleTypeChange(newType) {
    setForm({
      ...form,
      typeBonCommande: newType,
      // Reset the opposite field when switching types
      fournisseur: newType === "achat" ? form.fournisseur : "",
      client: newType === "vente" ? form.client : ""
    });
  }

  // Add produit to liste
  function addProduitToListe() {
    setForm({
      ...form,
      listeProduits: [...form.listeProduits, { idProduit: "", quantite: 1, nomProduit: "" }],
    });
  }

  // Update produit in liste
  function updateProduit(index, field, value) {
    const newListe = [...form.listeProduits];
    newListe[index][field] = value;
    
    // If updating idProduit, also update nomProduit
    if (field === "idProduit") {
      const produit = produits.find(p => p._id === value);
      newListe[index].nomProduit = produit?.nom || "";
    }
    
    setForm({ ...form, listeProduits: newListe });
  }

  // Remove produit from liste
  function removeProduit(index) {
    const newListe = [...form.listeProduits];
    newListe.splice(index, 1);
    setForm({ ...form, listeProduits: newListe });
  }

  // ✅ FIXED: Submit form with proper validation
  async function handleSubmit(e) {
    e.preventDefault();
    
    // ✅ Frontend validation before sending
    if (form.typeBonCommande === "achat" && (!form.fournisseur || form.fournisseur.trim() === "")) {
      alert("Veuillez sélectionner un fournisseur pour un bon de commande d'achat");
      return;
    }
    
    if (form.typeBonCommande === "vente" && (!form.client || form.client.trim() === "")) {
      alert("Veuillez sélectionner un client pour un bon de commande de vente");
      return;
    }

    try {
      const method = editId ? "PUT" : "POST";
      const url = editId ? `${API_URL}/${editId}` : API_URL;
      const token = localStorage.getItem("token");

      // ✅ CRITICAL: Build payload correctly based on type
      const payload = {
        numeroCommande: form.numeroCommande,
        dateCommande: form.dateCommande,
        typeBonCommande: form.typeBonCommande, // ✅ Use the correct field name
        listeProduits: form.listeProduits.map(p => ({
          idProduit: p.idProduit,
          nomProduit: p.nomProduit,
          quantite: Number(p.quantite),
        })),
        statut: form.statut,
        description: form.description,
      };

      // ✅ Only add fournisseur OR client based on type
      if (form.typeBonCommande === "achat") {
        payload.fournisseur = form.fournisseur;
      } else if (form.typeBonCommande === "vente") {
        payload.client = form.client;
      }

      console.log("📤 Submitting payload:", payload);

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();
      console.log("📥 Server response:", result);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status} - ${result.message || 'Unknown error'}`);
      }

      // Reset form
      setForm({
        numeroCommande: "",
        dateCommande: "",
        typeBonCommande: "achat",
        listeProduits: [],
        statut: "En attente",
        fournisseur: "",
        client: "",
        description: "",
      });
      setEditId(null);
      fetchBonCommandes();
      
      alert(editId ? "Bon de commande modifié avec succès!" : "Bon de commande ajouté avec succès!");
      
    } catch (error) {
      console.error("Submit error:", error);
      alert(`Erreur: ${error.message}`);
    }
  }

  // Edit bonCommande
  function handleEdit(bonCommande) {
    setEditId(bonCommande._id);
    setForm({
      numeroCommande: bonCommande.numeroCommande,
      dateCommande: bonCommande.dateCommande?.slice(0, 10),
      typeBonCommande: bonCommande.typeBonCommande,
      listeProduits: (bonCommande.listeProduits || []).map((lp) => ({
        idProduit: lp.idProduit?._id || lp.idProduit,
        nomProduit: lp.nomProduit || (lp.idProduit?.nom) || "",
        quantite: lp.quantite,
      })),
      statut: bonCommande.statut,
      fournisseur: bonCommande.fournisseur?._id || bonCommande.fournisseur || "",
      client: bonCommande.client?._id || bonCommande.client || "",
      description: bonCommande.description || "",
    });
  }

  // Delete bonCommande
  async function handleDelete(id) {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer ce bon de commande?")) {
      try {
        const token = localStorage.getItem("token");
        await fetch(`${API_URL}/${id}`, {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        });
        fetchBonCommandes();
        alert("Bon de commande supprimé avec succès!");
      } catch (error) {
        console.error("Delete error:", error);
        alert("Erreur lors de la suppression");
      }
    }
  }

  return (
    <div style={{ maxWidth: "1000px", margin: "auto", padding: "1rem" }}>
      <h2>{editId ? "Modifier Bon de Commande" : "Ajouter Bon de Commande"}</h2>

      <form onSubmit={handleSubmit} style={{ marginBottom: "1.5rem" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "1rem" }}>
          <input
            placeholder="Numéro Commande"
            value={form.numeroCommande}
            onChange={(e) => setForm({ ...form, numeroCommande: e.target.value })}
            required
          />
          <input
            type="date"
            value={form.dateCommande}
            onChange={(e) => setForm({ ...form, dateCommande: e.target.value })}
            required
          />
        </div>

        {/* ✅ CRITICAL: Type selector */}
        <div style={{ marginBottom: "1rem" }}>
          <label>Type de Bon de Commande:</label>
          <select
            value={form.typeBonCommande}
            onChange={(e) => handleTypeChange(e.target.value)}
            required
            style={{ marginLeft: "0.5rem" }}
          >
            <option value="achat">Achat (vers fournisseur)</option>
            <option value="vente">Vente (du client)</option>
          </select>
        </div>

        {/* ✅ Conditional rendering based on type */}
        {form.typeBonCommande === "achat" && (
          <select
            value={form.fournisseur}
            onChange={(e) => setForm({ ...form, fournisseur: e.target.value })}
            required
            style={{ marginBottom: "1rem", width: "100%" }}
          >
            <option value="">-- Choisir fournisseur ({fournisseurs.length}) --</option>
            {fournisseurs.map((f) => (
              <option key={f._id} value={f._id}>
                {f.name || f.nom}
              </option>
            ))}
          </select>
        )}

        {form.typeBonCommande === "vente" && (
          <select
            value={form.client}
            onChange={(e) => setForm({ ...form, client: e.target.value })}
            required
            style={{ marginBottom: "1rem", width: "100%" }}
          >
            <option value="">-- Choisir client ({clients.length}) --</option>
            {clients.map((c) => (
              <option key={c._id} value={c._id}>
                {c.name || c.nom}
              </option>
            ))}
          </select>
        )}

        <select
          value={form.statut}
          onChange={(e) => setForm({ ...form, statut: e.target.value })}
          style={{ marginBottom: "1rem", width: "100%" }}
        >
          <option>En attente</option>
          <option>En cours</option>
          <option>Répondu</option>
          <option>Annulé</option>
        </select>

        <textarea
          placeholder="Description (optionnelle)"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          style={{ marginBottom: "1rem", width: "100%", height: "60px" }}
        />

        <h4>Produits ({form.listeProduits.length})</h4>
        {form.listeProduits.map((p, index) => (
          <div key={index} style={{ display: "flex", gap: "0.5rem", marginBottom: "0.5rem", alignItems: "center" }}>
            <select
              value={p.idProduit}
              onChange={(e) => updateProduit(index, "idProduit", e.target.value)}
              required
              style={{ flex: 2 }}
            >
              <option value="">Choisir produit</option>
              {produits.map((prod) => (
                <option key={prod._id} value={prod._id}>
                  {prod.nom} ({prod.prixUnitaire || 0}€)
                </option>
              ))}
            </select>
            <input
              type="number"
              min="1"
              placeholder="Qté"
              value={p.quantite}
              onChange={(e) => updateProduit(index, "quantite", Number(e.target.value))}
              required
              style={{ width: "80px" }}
            />
            <button type="button" onClick={() => removeProduit(index)} style={{ background: "red", color: "white" }}>
              ✕
            </button>
          </div>
        ))}

        <button type="button" onClick={addProduitToListe} style={{ marginBottom: "1rem" }}>
          + Ajouter produit
        </button>

        <br />
        <button type="submit" style={{ background: "green", color: "white", padding: "0.5rem 1rem" }}>
          {editId ? "Mettre à jour" : "Ajouter"}
        </button>
        {editId && (
          <button 
            type="button" 
            onClick={() => {
              setEditId(null);
              setForm({
                numeroCommande: "",
                dateCommande: "",
                typeBonCommande: "achat",
                listeProduits: [],
                statut: "En attente",
                fournisseur: "",
                client: "",
                description: "",
              });
            }}
            style={{ background: "gray", color: "white", padding: "0.5rem 1rem", marginLeft: "0.5rem" }}
          >
            Annuler
          </button>
        )}
      </form>

      <h2>Liste des Bons de Commande ({bonCommandes.length})</h2>
      <table style={{ width: "100%", borderCollapse: "collapse", border: "1px solid #ddd" }}>
        <thead>
          <tr style={{ background: "#f5f5f5" }}>
            <th style={{ border: "1px solid #ddd", padding: "8px" }}>Numéro</th>
            <th style={{ border: "1px solid #ddd", padding: "8px" }}>Date</th>
            <th style={{ border: "1px solid #ddd", padding: "8px" }}>Type</th>
            <th style={{ border: "1px solid #ddd", padding: "8px" }}>Fournisseur/Client</th>
            <th style={{ border: "1px solid #ddd", padding: "8px" }}>Produits</th>
            <th style={{ border: "1px solid #ddd", padding: "8px" }}>Statut</th>
            <th style={{ border: "1px solid #ddd", padding: "8px" }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {bonCommandes.length === 0 ? (
            <tr>
              <td colSpan="7" style={{ textAlign: "center", padding: "20px", border: "1px solid #ddd" }}>
                Aucun bon de commande trouvé.
              </td>
            </tr>
          ) : (
            bonCommandes.map((bc) => (
              <tr key={bc._id}>
                <td style={{ border: "1px solid #ddd", padding: "8px" }}>{bc.numeroCommande}</td>
                <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                  {bc.dateCommande ? new Date(bc.dateCommande).toLocaleDateString() : "—"}
                </td>
                <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                  <span style={{ 
                    background: bc.typeBonCommande === "achat" ? "#e3f2fd" : "#f3e5f5",
                    padding: "2px 6px",
                    borderRadius: "4px"
                  }}>
                    {bc.typeBonCommande}
                  </span>
                </td>
                <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                  {bc.typeBonCommande === "achat" 
                    ? (bc.fournisseur?.name || bc.fournisseur?.nom || "Fournisseur non trouvé")
                    : (bc.client?.name || bc.client?.nom || "Client non trouvé")
                  }
                </td>
                <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                  {bc.listeProduits?.map((lp, i) => (
                    <div key={i} style={{ fontSize: "0.9em" }}>
                      {lp.nomProduit} × {lp.quantite}
                    </div>
                  ))}
                </td>
                <td style={{ border: "1px solid #ddd", padding: "8px" }}>{bc.statut}</td>
                <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                  <button onClick={() => handleEdit(bc)} style={{ marginRight: "5px" }}>Modifier</button>
                  <button onClick={() => handleDelete(bc._id)} style={{ background: "red", color: "white" }}>
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