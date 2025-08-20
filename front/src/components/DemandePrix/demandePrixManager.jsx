import React, { useState, useEffect } from "react";

export default function DemandePrixManager() {
  const [demandes, setDemandes] = useState([]);
  const [fournisseurs, setFournisseurs] = useState([]);
  const [produits, setProduits] = useState([]);
  const [debugInfo, setDebugInfo] = useState({}); // Add debug state

  const [form, setForm] = useState({
    numeroDemande: "",
    dateDemande: "",
    listeProduits: [],
    statut: "En attente",
    fournisseur: "",
    description: "",
  });

  const [editId, setEditId] = useState(null);

  const API_URL = "http://localhost:5000/api/demandePrix";
  const API_FOURNISSEURS = "http://localhost:5000/api/fournisseurs";
  const API_PRODUITS = "http://localhost:5000/api/produits";

  // Enhanced fetch demandes with detailed debugging
  async function fetchDemandes() {
    console.log("🚀 Starting fetchDemandes...");
    
    try {
      const token = localStorage.getItem("token");
      console.log("📝 Token exists:", !!token);
      console.log("📝 Token preview:", token ? token.substring(0, 20) + "..." : "No token");

      const headers = {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      };
      console.log("📤 Request headers:", headers);
      console.log("📍 API URL:", API_URL);

      const res = await fetch(API_URL, { headers });
      
      console.log("📥 Response status:", res.status);
      console.log("📥 Response ok:", res.ok);
      console.log("📥 Response headers:", Object.fromEntries(res.headers.entries()));

      const data = await res.json();
      console.log("📦 Full API Response:", data);
      console.log("📊 Response structure:", {
        hasSuccess: 'success' in data,
        successValue: data.success,
        hasData: 'data' in data,
        dataType: typeof data.data,
        dataLength: Array.isArray(data.data) ? data.data.length : 'not array',
        dataContent: data.data
      });

      // Update debug info for display
      setDebugInfo({
        lastFetch: new Date().toISOString(),
        apiResponse: data,
        tokenExists: !!token,
        responseStatus: res.status,
        dataLength: Array.isArray(data.data) ? data.data.length : 0
      });

      if (data.success && Array.isArray(data.data)) {
        console.log("✅ Setting demandes:", data.data);
        setDemandes(data.data);
      } else {
        console.log("❌ Invalid response structure, setting empty array");
        setDemandes([]);
      }

    } catch (error) {
      console.error("💥 Fetch demandes error:", error);
      console.error("💥 Error name:", error.name);
      console.error("💥 Error message:", error.message);
      console.error("💥 Error stack:", error.stack);
      
      setDebugInfo(prev => ({
        ...prev,
        lastError: {
          name: error.name,
          message: error.message,
          timestamp: new Date().toISOString()
        }
      }));
      
      setDemandes([]);
    }
  }

  // Enhanced fetch fournisseurs with debugging
  async function fetchFournisseurs() {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(API_FOURNISSEURS, {
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
      });
      
      console.log("🏭 Fournisseurs response status:", res.status);
      
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      const data = await res.json();
      
      console.log("🏭 Fournisseurs data:", data);
      setFournisseurs(data.data || data);
      
    } catch (error) {
      console.error("💥 Fetch fournisseurs error:", error);
      setFournisseurs([]);
    }
  }

  // Enhanced fetch produits with debugging
  async function fetchProduits() {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(API_PRODUITS, {
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
      });
      
      console.log("📦 Produits response status:", res.status);
      
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      const data = await res.json();
      
      console.log("📦 Produits data:", data);
      setProduits(data.data || data);
      
    } catch (error) {
      console.error("💥 Fetch produits error:", error);
      setProduits([]);
    }
  }

  useEffect(() => {
    console.log("🎯 Component mounted, starting data fetch...");
    fetchDemandes();
    fetchFournisseurs();
    fetchProduits();
  }, []);

  // Helper to get fournisseur name
  const getFournisseurName = (fournisseur) =>
    fournisseur?.name || fournisseur?.nom || "Sans nom";

  // Add produit to liste
  function addProduitToListe() {
    setForm({
      ...form,
      listeProduits: [...form.listeProduits, { idProduit: "", quantiteDemandee: 1 }],
    });
  }

  // Update produit in liste
  function updateProduit(index, field, value) {
    const newListe = [...form.listeProduits];
    newListe[index][field] = value;
    setForm({ ...form, listeProduits: newListe });
  }

  // Remove produit from liste
  function removeProduit(index) {
    const newListe = [...form.listeProduits];
    newListe.splice(index, 1);
    setForm({ ...form, listeProduits: newListe });
  }

  // Submit form
  async function handleSubmit(e) {
    e.preventDefault();
    try {
      const method = editId ? "PUT" : "POST";
      const url = editId ? `${API_URL}/${editId}` : API_URL;
      const token = localStorage.getItem("token");

      console.log("Form products to submit:", form.listeProduits);

      const payload = {
        ...form,
        numeroDemande: form.numeroDemande,
        listeProduits: form.listeProduits.map(p => {
          const produit = produits.find(prod => prod._id === p.idProduit);
          return {
            idProduit: p.idProduit,
            nomProduit: produit?.nom || "",
            quantiteDemandee: Number(p.quantiteDemandee),
          };
        }),
      };

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // Reset form
      setForm({
        numeroDemande: "",
        dateDemande: "",
        listeProduits: [],
        statut: "En attente",
        fournisseur: "",
        description: "",
      });
      setEditId(null);
      fetchDemandes();
    } catch (error) {
      console.error("Submit error:", error);
    }
  }

  // Edit demande
  function handleEdit(demande) {
    setEditId(demande._id);
    setForm({
      numeroDemande: demande.numeroDemande,
      dateDemande: demande.dateDemande?.slice(0, 10),
      listeProduits: (demande.listeProduits || []).map((lp) => ({
        idProduit: lp.idProduit?._id || lp.idProduit,
        nomProduit: lp.idProduit?.nom || "",
        quantiteDemandee: lp.quantiteDemandee,
      })),
      statut: demande.statut,
      fournisseur: demande.fournisseur?._id || demande.fournisseur,
      description: demande.description,
    });
  }

  // Delete demande
  async function handleDelete(id) {
    try {
      const token = localStorage.getItem("token");
      await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchDemandes();
    } catch (error) {
      console.error("Delete error:", error);
    }
  }

  return (
    <div style={{ maxWidth: "900px", margin: "auto", padding: "1rem" }}>

      <h2>{editId ? "Modifier Demande de Prix" : "Ajouter Demande de Prix"}</h2>

      <form onSubmit={handleSubmit} style={{ marginBottom: "1.5rem" }}>
        <input
          placeholder="Numéro Demande"
          value={form.numeroDemande}
          onChange={(e) => setForm({ ...form, numeroDemande: e.target.value })}
          required
        />
        <input
          type="date"
          value={form.dateDemande}
          onChange={(e) => setForm({ ...form, dateDemande: e.target.value })}
        />
        <select
          value={form.fournisseur}
          onChange={(e) => setForm({ ...form, fournisseur: e.target.value })}
          required
        >
          <option value="">-- Choisir fournisseur ({fournisseurs.length}) --</option>
          {fournisseurs.map((f) => (
            <option key={f._id} value={f._id}>
              {f.name}
            </option>
          ))}
        </select>
        
        <select
          value={form.statut}
          onChange={(e) => setForm({ ...form, statut: e.target.value })}
        >
          <option>En attente</option>
          <option>En cours</option>
          <option>Répondu</option>
          <option>Annulé</option>
        </select>

        <textarea
          placeholder="Description"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
        />

        <h4>Produits demandés</h4>
        {form.listeProduits.map((p, index) => (
          <div key={index} style={{ display: "flex", gap: "0.5rem", marginBottom: "0.5rem" }}>
            <select
              value={p.idProduit}
              onChange={(e) => updateProduit(index, "idProduit", e.target.value)}
              required
            >
              <option value="">Choisir produit</option>
              {produits.map((prod) => (
                <option key={prod._id} value={prod._id}>
                  {prod.nom} ({prod.prixUnitaire}€)
                </option>
              ))}
            </select>
            <input
              type="number"
              min="1"
              value={p.quantiteDemandee}
              onChange={(e) => updateProduit(index, "quantiteDemandee", Number(e.target.value))}
              required
            />
            <button type="button" onClick={() => removeProduit(index)}>
              Supprimer
            </button>
          </div>
        ))}

        <button type="button" onClick={addProduitToListe}>
          + Ajouter produit
        </button>

        <br />
        <br />
        <button type="submit">{editId ? "Mettre à jour" : "Ajouter"}</button>
      </form>

      <h2>Liste des Demandes de Prix</h2>
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th>Numéro</th>
            <th>Date</th>
            <th>Fournisseur</th>
            <th>Produits</th>
            <th>Statut</th>
            <th>Description</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {demandes.length === 0 ? (
            <tr>
              <td colSpan="7" style={{ textAlign: "center" }}>
                Aucune demande trouvée.
              </td>
            </tr>
          ) : (
            demandes.map((d) => (
              <tr key={d._id}>
                <td>{d.numeroDemande}</td>
                <td>{d.dateDemande ? new Date(d.dateDemande).toLocaleDateString() : "—"}</td>
                <td>{getFournisseurName(d.fournisseur)}</td>
                <td>
                  {d.listeProduits?.map((lp, i) => {
                    const nomProduit =
                      lp.nomProduit ||
                      (lp.idProduit && typeof lp.idProduit === "object" ? lp.idProduit.nom : lp.idProduit);
                    return (
                      <div key={i}>
                        {nomProduit} - {lp.quantiteDemandee}
                      </div>
                    );
                  })}
                </td>
                <td>{d.statut}</td>
                <td>{d.description}</td>
                <td>
                  <button onClick={() => handleEdit(d)}>Modifier</button>
                  <button onClick={() => handleDelete(d._id)}>Supprimer</button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}