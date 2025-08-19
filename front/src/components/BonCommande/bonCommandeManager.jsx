import React, { useState, useEffect } from "react";

export default function BonCommandeManager() {
  const [commandes, setCommandes] = useState([]);
  const [fournisseurs, setFournisseurs] = useState([]);
  const [clients, setClients] = useState([]);
  const [produits, setProduits] = useState([]);

  const [form, setForm] = useState({
    numeroCommande: "",
    dateCommande: "",
    type: "achat",
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

  // --- Fetch functions ---
  const fetchCommandes = async () => {
    try {
      const res = await fetch(API_URL);
      const data = await res.json();
      setCommandes(data.data || data);
    } catch (err) {
      console.error("Erreur fetch commandes:", err);
    }
  };

  const fetchFournisseurs = async () => {
    try {
      const res = await fetch(API_FOURNISSEURS);
      const data = await res.json();
      setFournisseurs(data.data || data);
    } catch (err) {
      console.error("Erreur fetch fournisseurs:", err);
    }
  };

  const fetchClients = async () => {
    try {
      const res = await fetch(API_CLIENTS);
      const data = await res.json();
      setClients(data.data || data);
    } catch (err) {
      console.error("Erreur fetch clients:", err);
    }
  };

  const fetchProduits = async () => {
    try {
      const res = await fetch(API_PRODUITS);
      const data = await res.json();
      setProduits(data.data || data);
    } catch (err) {
      console.error("Erreur fetch produits:", err);
    }
  };

  useEffect(() => {
    fetchCommandes();
    fetchFournisseurs();
    fetchClients();
    fetchProduits();
  }, []);

  const getFournisseurName = (f) => f?.nom || f?.name || "Sans nom";
  const getClientName = (c) => c?.nom || c?.name || "Sans nom";

  // --- Form handlers ---
  const addProduitToListe = () => {
    setForm({
      ...form,
      listeProduits: [
        ...form.listeProduits,
        { idProduit: "", nomProduit: "", quantite: 1 },
      ],
    });
  };

  const updateProduit = (index, field, value) => {
    const newListe = [...form.listeProduits];
    newListe[index][field] = value;

    // auto-set nomProduit if selecting a product from list
    if (field === "idProduit") {
      const prod = produits.find((p) => p._id === value);
      newListe[index].nomProduit = prod?.nom || "Produit inconnu";
    }

    setForm({ ...form, listeProduits: newListe });
  };

  const removeProduit = (index) => {
    const newListe = [...form.listeProduits];
    newListe.splice(index, 1);
    setForm({ ...form, listeProduits: newListe });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const method = editId ? "PUT" : "POST";
      const url = editId ? `${API_URL}/${editId}` : API_URL;

      const payload = {
        ...form,
        typeBonCommande: form.type,
        fournisseur:
          form.type === "achat" && form.fournisseur ? form.fournisseur : null,
        client: form.type === "vente" && form.client ? form.client : null,
        dateCommande: form.dateCommande ? new Date(form.dateCommande) : undefined,
        listeProduits: form.listeProduits.map((p) => ({
          idProduit: p.idProduit,
          nomProduit:
            produits.find((prod) => prod._id === p.idProduit)?.nom || p.nomProduit || "Produit inconnu",
          quantite: p.quantite,
        })),
      };

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errText = await res.text();
        throw new Error(`Server Error: ${res.status} - ${errText}`);
      }

      setForm({
        numeroCommande: "",
        dateCommande: "",
        type: "achat",
        listeProduits: [],
        statut: "En attente",
        fournisseur: "",
        client: "",
        description: "",
      });
      setEditId(null);
      fetchCommandes();
    } catch (err) {
      console.error("Erreur submit:", err);
    }
  };

  const handleEdit = (commande) => {
    setEditId(commande._id);
    setForm({
      numeroCommande: commande.numeroCommande,
      dateCommande: commande.dateCommande?.slice(0, 10) || "",
      type: commande.typeBonCommande || "achat",
      listeProduits: (commande.listeProduits || []).map((lp) => ({
        idProduit: lp.idProduit?._id || lp.idProduit,
        nomProduit: lp.idProduit?.nom || lp.nomProduit || "Produit inconnu",
        quantite: lp.quantite || 1,
      })),
      statut: commande.statut || "En attente",
      fournisseur: commande.fournisseur?._id || "",
      client: commande.client?._id || "",
      description: commande.description || "",
    });
  };

  const handleDelete = async (id) => {
    try {
      await fetch(`${API_URL}/${id}`, { method: "DELETE" });
      fetchCommandes();
    } catch (err) {
      console.error("Erreur delete:", err);
    }
  };

  // --- Render ---
  return (
    <div style={{ maxWidth: "900px", margin: "auto", padding: "1rem" }}>
      <h2>{editId ? "Modifier Bon de Commande" : "Ajouter Bon de Commande"}</h2>
      <form onSubmit={handleSubmit} style={{ marginBottom: "1.5rem" }}>
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
        />

        <select
          value={form.type}
          onChange={(e) =>
            setForm({ ...form, type: e.target.value, fournisseur: "", client: "" })
          }
        >
          <option value="achat">Achat</option>
          <option value="vente">Vente</option>
        </select>

        {form.type === "achat" && (
          <select
            value={form.fournisseur}
            onChange={(e) => setForm({ ...form, fournisseur: e.target.value })}
            required
          >
            <option value="">-- Choisir fournisseur --</option>
            {fournisseurs.map((f) => (
              <option key={f._id} value={f._id}>
                {getFournisseurName(f)}
              </option>
            ))}
          </select>
        )}
        {form.type === "vente" && (
          <select
            value={form.client}
            onChange={(e) => setForm({ ...form, client: e.target.value })}
            required
          >
            <option value="">-- Choisir client --</option>
            {clients.map((c) => (
              <option key={c._id} value={c._id}>
                {getClientName(c)}
              </option>
            ))}
          </select>
        )}

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

        <h4>Produits commandés</h4>
        {form.listeProduits.map((p, index) => (
          <div key={index} className="product-row">
            <select
              value={p.idProduit}
              onChange={(e) => updateProduit(index, "idProduit", e.target.value)}
              required
            >
              <option value={p.idProduit}>
                {p.nomProduit ||
                  produits.find((prod) => prod._id === p.idProduit)?.nom ||
                  "Choisir produit"}
              </option>
              {produits
                .filter((prod) => prod._id !== p.idProduit)
                .map((prod) => (
                  <option key={prod._id} value={prod._id}>
                    {prod.nom} ({prod.prixUnitaire}€)
                  </option>
                ))}
            </select>

            <input
              type="number"
              min="1"
              value={p.quantite}
              onChange={(e) =>
                updateProduit(index, "quantite", Number(e.target.value))
              }
              required
            />
            <button type="button" onClick={() => removeProduit(index)}>
              ❌
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

      <h2>Liste des Bons de Commande</h2>
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th>Numéro</th>
            <th>Date</th>
            <th>Type</th>
            <th>Fournisseur / Client</th>
            <th>Produits</th>
            <th>Statut</th>
            <th>Description</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {commandes.length === 0 ? (
            <tr>
              <td colSpan="8" style={{ textAlign: "center" }}>
                Aucun bon de commande trouvé.
              </td>
            </tr>
          ) : (
            commandes.map((commande) => (
              <tr key={commande._id}>
                <td>{commande.numeroCommande}</td>
                <td>{commande.dateCommande?.slice(0, 10) || "—"}</td>
                <td>{commande.typeBonCommande || "—"}</td>
                <td>
                  {commande.typeBonCommande === "achat"
                    ? getFournisseurName(commande.fournisseur)
                    : getClientName(commande.client)}
                </td>
                <td>
                  {Array.isArray(commande.listeProduits) &&
                  commande.listeProduits.length > 0 ? (
                    <ul style={{ paddingLeft: "1rem", margin: 0 }}>
                      {commande.listeProduits.map((p, idx) => (
                        <li key={idx}>
                          {p.idProduit?.nom || p.nomProduit || "Produit inconnu"} —{" "}
                          {p.quantite || 1}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    "—"
                  )}
                </td>
                <td>{commande.statut || "—"}</td>
                <td>{commande.description || "—"}</td>
                <td>
                  <button onClick={() => handleEdit(commande)}>✏️</button>{" "}
                  <button onClick={() => handleDelete(commande._id)}>🗑️</button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
