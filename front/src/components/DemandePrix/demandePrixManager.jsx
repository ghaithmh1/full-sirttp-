import React, { useState, useEffect } from "react";

export default function DemandePrixManager() {
  const [demandes, setDemandes] = useState([]);
  const [fournisseurs, setFournisseurs] = useState([]);
  const [produits, setProduits] = useState([]);

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

  // Fetch demandes
  async function fetchDemandes() {
    try {
      const res = await fetch(API_URL);
      const data = await res.json();
      //console.log("Demandes data:", data); // Debug
      setDemandes(data.data || data);
    } catch (error) {
      console.error("Erreur fetch demandes:", error);
    }
  }

  // Fetch fournisseurs
  async function fetchFournisseurs() {
    try {
      //console.log("Fetching fournisseurs from:", API_FOURNISSEURS); 
      const res = await fetch(API_FOURNISSEURS);
      
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      
      const data = await res.json();
      //console.log("Fournisseurs raw response:", data); // Debug
      
      const fournisseursData = data.data || data;
      //console.log("Fournisseurs processed:", fournisseursData); // Debug
      
      setFournisseurs(fournisseursData);
    } catch (error) {
      console.error("Erreur fetch fournisseurs:", error);
    }
  }

  // Fetch produits
  async function fetchProduits() {
    try {
     // console.log("Fetching produits from:", API_PRODUITS); // Debug
      const res = await fetch(API_PRODUITS);
      
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      
      const data = await res.json();
      //console.log("Produits raw response:", data); // Debug
      
      const produitsData = data.data || data;
      //console.log("Produits processed:", produitsData); // Debug
      
      setProduits(produitsData);
    } catch (error) {
      console.error("Erreur fetch produits:", error);
    }
  }

  useEffect(() => {
    fetchDemandes();
    fetchFournisseurs();
    fetchProduits();
  }, []);
/*
  // Debug: Log state changes
  useEffect(() => {
    console.log("Fournisseurs state updated:", fournisseurs);
  }, [fournisseurs]);

  useEffect(() => {
    console.log("Produits state updated:", produits);
  }, [produits]);
*/
  const getFournisseurName = (fournisseur) => {
  if (!fournisseur) return "Sans nom";
  return fournisseur.name || fournisseur.nom || "Sans nom";
};


  
  // Handle ajout produit
  function addProduitToListe() {
    setForm({
      ...form,
      listeProduits: [...form.listeProduits, { idProduit: "", quantiteDemandee: 1 }],
    });
  }

  // Modifier un produit dans la liste
  function updateProduit(index, field, value) {
    const newListe = [...form.listeProduits];
    newListe[index][field] = value;
    setForm({ ...form, listeProduits: newListe });
  }

  // Supprimer un produit de la liste
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

      //console.log("Submitting form data:", form); // Debug

      await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

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
      console.error("Erreur submit:", error);
    }
  }

  // Edit
  function handleEdit(demande) {
    setEditId(demande._id);
    setForm({
      numeroDemande: demande.numeroDemande,
      dateDemande: demande.dateDemande?.slice(0, 10),
      listeProduits: (demande.listeProduits || []).map(lp => ({
      idProduit: lp.idProduit?._id || lp.idProduit,
      nomProduit: lp.idProduit?.nom || "",      // store name for display
      quantiteDemandee: lp.quantiteDemandee
    })),
      statut: demande.statut,
      fournisseur: demande.fournisseur?._id || demande.fournisseur,
      description: demande.description,
    });
  }

  // Delete
  async function handleDelete(id) {
    try {
      await fetch(`${API_URL}/${id}`, { method: "DELETE" });
      fetchDemandes();
    } catch (error) {
      console.error("Erreur delete:", error);
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

        {/* Dropdown fournisseurs */}
        <select
          value={form.fournisseur}
          onChange={(e) => setForm({ ...form, fournisseur: e.target.value })}
          required
        >
          <option value="">-- Choisir fournisseur ({fournisseurs.length} disponibles) --</option>
          {fournisseurs.map((f) => (
            <option key={f._id} value={f._id}>
              {f.name} {/* Fournisseurs use 'name' field */}
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

        {/* Liste Produits */}
        <h4>Produits demandés</h4>
        {form.listeProduits.map((p, index) => (
        <div key={index} className="product-row">
          <select
            value={p.idProduit}
            onChange={(e) => updateProduit(index, "idProduit", e.target.value)}
            required
          >
            <option value={p.idProduit}>{p.nomProduit || "Choisir produit"}</option>
            {produits
              .filter(prod => prod._id !== p.idProduit) // avoid duplicate in list
              .map((prod) => (
                <option key={prod._id} value={prod._id}>
                  {prod.nom} ({prod.prixUnitaire}€)
                </option>
            ))}
          </select>

          <input
            type="number"
            value={p.quantiteDemandee}
            onChange={(e) => updateProduit(index, "quantiteDemandee", e.target.value)}
            required
          />
        </div>
      ))}


        <button type="button" onClick={addProduitToListe}>+ Ajouter produit</button>

        <br /><br />
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
              <td colSpan="7" style={{ textAlign: "center" }}>Aucune demande trouvée.</td>
            </tr>
          ) : (
            demandes.map((d) => (
              <tr key={d._id}>
                <td>{d.numeroDemande}</td>
                <td>{d.dateDemande ? new Date(d.dateDemande).toLocaleDateString() : "—"}</td>
                <td>{getFournisseurName(d.fournisseur)}</td>
                <td>
                  {d.listeProduits?.map((lp, i) => (
                    <div key={i}>
                      {typeof lp.idProduit === "object"
                        ? lp.idProduit.nom
                        : lp.idProduit}{" "}
                      - {lp.quantiteDemandee}
                    </div>
                  ))}
                </td>
                <td>{d.statut}</td>
                <td>{d.description}</td>
                <td>
                  <button onClick={() => handleEdit(d)}>✏️</button>
                  <button onClick={() => handleDelete(d._id)}>🗑️</button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}