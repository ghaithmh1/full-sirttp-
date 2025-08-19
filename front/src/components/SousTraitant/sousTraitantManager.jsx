import React, { useState, useEffect } from "react";

export default function SousTraitantManager() {
  const [sousTraitants, setSousTraitants] = useState([]);
  const [form, setForm] = useState({ name: "", email: "", phone: "", address: "" });
  const [editId, setEditId] = useState(null);
  const API_URL = "http://localhost:5000/api/sousTraitants"; 

  // Fetch sousTraitants from backend
  async function fetchSousTraitants() {
    try {
      const res = await fetch(API_URL);
      const data = await res.json();
      //const data = await res.data.json();
      //debug
      console.log("Fetched data:", data);
      
      setSousTraitants(data.data);
    } catch (error) {
      console.error("Fetch error:", error);
    }
  }

  useEffect(() => {
    fetchSousTraitants();
  }, []);

  // Handle form submission for Add or Edit
  async function handleSubmit(e) {

    e.preventDefault();
    console.log("handleSubmit triggered", form);
    try {
      const method = editId ? "PUT" : "POST";
      const url = editId ? `${API_URL}/${editId}` : API_URL;

      await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      setForm({ name: "", email: "", phone: "", address: "" });
      setEditId(null);
      fetchSousTraitants();
    } catch (error) {
      console.error("Submit error:", error);
    }
  }

  // Prepare form for editing
  function handleEdit(sousTraitant) {
    setEditId(sousTraitant._id);
    setForm({
      name: sousTraitant.name || "",
      email: sousTraitant.email || "",
      phone: sousTraitant.phone || "",
      address: sousTraitant.address || "",
    });
  }

  // Delete a sousTraitant
  async function handleDelete(id) {
    try {
      await fetch(`${API_URL}/${id}`, { method: "DELETE" });
      fetchSousTraitants();
    } catch (error) {
      console.error("Delete error:", error);
    }
  }

  return (
    <div style={{ maxWidth: "800px", margin: "auto", padding: "1rem" }}>
    <h2>{editId ? "Edit Sous Traitant" : "Add Sous Traitant"}</h2>
    <form onSubmit={handleSubmit} style={{ marginBottom: "1.5rem", display: "flex", gap: "1rem", flexWrap: "wrap" }}>
      <input
        placeholder="Name"
        value={form.name}
        onChange={(e) => setForm({ ...form, name: e.target.value })}
        required
        style={{ flex: "1 1 200px", padding: "0.5rem" }}
      />
      <input
        type="email"
        placeholder="Email"
        value={form.email}
        onChange={(e) => setForm({ ...form, email: e.target.value })}
        required
        style={{ flex: "1 1 200px", padding: "0.5rem" }}
      />
      <input
        placeholder="Phone"
        value={form.phone}
        onChange={(e) => setForm({ ...form, phone: e.target.value })}
        style={{ flex: "1 1 150px", padding: "0.5rem" }}
      />
      <input
        placeholder="Address"
        value={form.address}
        onChange={(e) => setForm({ ...form, address: e.target.value })}
        style={{ flex: "1 1 200px", padding: "0.5rem" }}
      />
      <div style={{ display: "flex", gap: "0.5rem" }}>
        <button type="submit" style={{ padding: "0.5rem 1rem" }}>
          {editId ? "Update" : "Add"}
        </button>
        {editId && (
          <button
            type="button"
            onClick={() => {
              setEditId(null);
              setForm({ name: "", email: "", phone: "", address: "" });
            }}
            style={{ padding: "0.5rem 1rem" }}
          >
            Cancel
          </button>
        )}
      </div>
    </form>

    <h2>Sous Traitants</h2>
    <table style={{ width: "100%", borderCollapse: "collapse" }}>
      <thead>
        <tr style={{ borderBottom: "2px solid #ccc" }}>
          <th style={{ textAlign: "left", padding: "0.5rem" }}>Name</th>
          <th style={{ textAlign: "left", padding: "0.5rem" }}>Email</th>
          <th style={{ textAlign: "left", padding: "0.5rem" }}>Phone</th>
          <th style={{ textAlign: "left", padding: "0.5rem" }}>Address</th>
          <th style={{ textAlign: "center", padding: "0.5rem" }}>Actions</th>
        </tr>
      </thead>
      <tbody>
        {sousTraitants.length === 0 ? (
          <tr>
            <td colSpan="5" style={{ padding: "1rem", textAlign: "center" }}>
              No sousTraitants found.
            </td>
          </tr>
        ) : (
          sousTraitants.map((sousTraitant) => (
            <tr key={sousTraitant._id} style={{ borderBottom: "1px solid #eee" }}>
              <td style={{ padding: "0.5rem" }}>{sousTraitant.name}</td>
              <td style={{ padding: "0.5rem" }}>{sousTraitant.email}</td>
              <td style={{ padding: "0.5rem" }}>{sousTraitant.phone}</td>
              <td style={{ padding: "0.5rem" }}>{sousTraitant.address}</td>
              <td style={{ padding: "0.5rem", textAlign: "center" }}>
                <button onClick={() => handleEdit(sousTraitant)} style={{ marginRight: "0.5rem" }}>
                  Edit
                </button>
                <button onClick={() => handleDelete(sousTraitant._id)} style={{ color: "red" }}>
                  Delete
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
