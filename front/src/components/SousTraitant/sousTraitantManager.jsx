import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function SousTraitantManager() {
  const [sousTraitants, setSousTraitants] = useState([]);
  const [form, setForm] = useState({ 
    name: "", 
    email: "", 
    phone: "", 
    address: "",
    specialite: ""  // Added missing required field
  });
  const [editId, setEditId] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const API_URL = "http://localhost:5000/api/sous-traitants"; 
  const navigate = useNavigate();

  // Helper function to get auth headers
  function getAuthHeaders() {
    const token = localStorage.getItem('token');
    return {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    };
  }

  // Fetch sousTraitants from backend
  async function fetchSousTraitants() {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }
      
      const res = await fetch(API_URL, {
        headers: getAuthHeaders()
      });
      
      if (res.status === 401) {
        localStorage.removeItem('token');
        navigate('/login');
        return;
      }
      
      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`Failed to fetch: ${res.status} ${res.statusText} - ${errorText}`);
      }
      
      const data = await res.json();
      setSousTraitants(data.data || []);
      setError("");
    } catch (error) {
      console.error("Fetch error:", error);
      setError("Failed to load sous-traitants. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchSousTraitants();
  }, []);

  // Handle form submission for Add or Edit
  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    
    // Enhanced validation to match backend requirements
    if (!form.name || !form.email || !form.phone || !form.address || !form.specialite) {
      setError("All fields are required");
      return;
    }

    try {
      const method = editId ? "PUT" : "POST";
      const url = editId ? `${API_URL}/${editId}` : API_URL;

      // Add entrepriseId to payload
      const entrepriseId = localStorage.getItem('entrepriseId');
      const payload = entrepriseId ? { ...form, entrepriseId } : form;

      const res = await fetch(url, {
        method,
        headers: getAuthHeaders(),
        body: JSON.stringify(payload),
      });

      if (res.status === 401) {
        localStorage.removeItem('token');
        navigate('/login');
        return;
      }
      
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Request failed');
      }

      // Reset form with all fields
      setForm({ name: "", email: "", phone: "", address: "", specialite: "" });
      setEditId(null);
      fetchSousTraitants();
    } catch (error) {
      console.error("Submit error:", error);
      setError(error.message || "An error occurred. Please try again.");
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
      specialite: sousTraitant.specialite || ""  // Added specialite
    });
  }

  // Delete a sousTraitant
  async function handleDelete(id) {
    if (!window.confirm("Are you sure you want to delete this sous-traitant?")) return;
    
    try {
      const res = await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
        headers: getAuthHeaders()
      });

      if (res.status === 401) {
        localStorage.removeItem('token');
        navigate('/login');
        return;
      }
      
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Failed to delete');
      }

      fetchSousTraitants();
    } catch (error) {
      console.error("Delete error:", error);
      setError("Failed to delete sous-traitant. Please try again.");
    }
  }

  return (
    <div style={{ maxWidth: "800px", margin: "auto", padding: "1rem" }}>
      <h2>{editId ? "Edit Sous Traitant" : "Add Sous Traitant"}</h2>
      
      {error && (
        <div style={{ 
          color: "red", 
          padding: "0.5rem", 
          marginBottom: "1rem",
          border: "1px solid red",
          borderRadius: "4px"
        }}>
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit} style={{ marginBottom: "1.5rem", display: "flex", gap: "1rem", flexWrap: "wrap" }}>
        <input
          placeholder="Name *"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          required
          style={{ flex: "1 1 200px", padding: "0.5rem" }}
        />
        <input
          type="email"
          placeholder="Email *"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          required
          style={{ flex: "1 1 200px", padding: "0.5rem" }}
        />
        <input
          placeholder="Phone *"
          value={form.phone}
          onChange={(e) => setForm({ ...form, phone: e.target.value })}
          required
          style={{ flex: "1 1 150px", padding: "0.5rem" }}
        />
        <input
          placeholder="Address *"
          value={form.address}
          onChange={(e) => setForm({ ...form, address: e.target.value })}
          required
          style={{ flex: "1 1 200px", padding: "0.5rem" }}
        />
        <input
          placeholder="Specialité *"
          value={form.specialite}
          onChange={(e) => setForm({ ...form, specialite: e.target.value })}
          required
          style={{ flex: "1 1 200px", padding: "0.5rem" }}
        />
        <div style={{ display: "flex", gap: "0.5rem", width: "100%" }}>
          <button 
            type="submit" 
            style={{ padding: "0.5rem 1rem" }}
            disabled={loading}
          >
            {editId ? "Update" : "Add"}
          </button>
          {editId && (
            <button
              type="button"
              onClick={() => {
                setEditId(null);
                setForm({ name: "", email: "", phone: "", address: "", specialite: "" });
                setError("");
              }}
              style={{ padding: "0.5rem 1rem" }}
              disabled={loading}
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      <h2>Sous Traitants</h2>
      
      {loading ? (
        <div style={{ textAlign: "center", padding: "2rem" }}>
          <p>Loading sous-traitants...</p>
        </div>
      ) : sousTraitants.length === 0 ? (
        <div style={{ padding: "1rem", textAlign: "center", border: "1px dashed #ccc", borderRadius: "4px" }}>
          No sous-traitants found
        </div>
      ) : (
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ borderBottom: "2px solid #ccc" }}>
              <th style={{ textAlign: "left", padding: "0.5rem" }}>Name</th>
              <th style={{ textAlign: "left", padding: "0.5rem" }}>Email</th>
              <th style={{ textAlign: "left", padding: "0.5rem" }}>Phone</th>
              <th style={{ textAlign: "left", padding: "0.5rem" }}>Address</th>
              <th style={{ textAlign: "left", padding: "0.5rem" }}>Specialité</th>
              <th style={{ textAlign: "center", padding: "0.5rem" }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {sousTraitants.map((sousTraitant) => (
              <tr key={sousTraitant._id} style={{ borderBottom: "1px solid #eee" }}>
                <td style={{ padding: "0.5rem" }}>{sousTraitant.name}</td>
                <td style={{ padding: "0.5rem" }}>{sousTraitant.email}</td>
                <td style={{ padding: "0.5rem" }}>{sousTraitant.phone}</td>
                <td style={{ padding: "0.5rem" }}>{sousTraitant.address}</td>
                <td style={{ padding: "0.5rem" }}>{sousTraitant.specialite}</td>
                <td style={{ padding: "0.5rem", textAlign: "center" }}>
                  <button 
                    onClick={() => handleEdit(sousTraitant)} 
                    style={{ marginRight: "0.5rem" }}
                    disabled={loading}
                  >
                    Edit
                  </button>
                  <button 
                    onClick={() => handleDelete(sousTraitant._id)} 
                    style={{ color: "red" }}
                    disabled={loading}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}