import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getFournisseurs, deleteFournisseur } from '../../services/fournisseurApi';
import FournisseurItem from './FournisseurItem';

const FournisseurList = () => {
  const [fournisseurs, setFournisseurs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchFournisseurs();
  }, []);

  const fetchFournisseurs = async () => {
    try {
      setLoading(true);
      const { data } = await getFournisseurs();
      setFournisseurs(data.data || []);
      setError(null);
    } catch (err) {
      console.error('Fetch error:', err);
      setError(err.response?.data?.message || 'Failed to load suppliers. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this supplier?')) return;
    
    try {
      setLoading(true);
      await deleteFournisseur(id);
      fetchFournisseurs();
    } catch (err) {
      console.error('Delete failed:', err);
      setError(err.response?.data?.message || 'Failed to delete supplier. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return (
    <div className="d-flex justify-content-center my-5">
      <div className="spinner-border text-primary" role="status">
        <span className="visually-hidden">Loading...</span>
      </div>
    </div>
  );

  if (error) return (
    <div className="container mt-4">
      <div className="alert alert-danger">{error}</div>
      <button className="btn btn-primary" onClick={fetchFournisseurs}>
        Retry
      </button>
    </div>
  );

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>
          <i className="bi bi-truck me-2"></i>
          Suppliers
        </h2>
        <Link to="/createFournisseur" className="btn btn-primary">
          <i className="bi bi-plus-lg me-2"></i>
          Add Supplier
        </Link>
      </div>

      {fournisseurs.length === 0 ? (
        <div className="card">
          <div className="card-body text-center py-5">
            <i className="bi bi-inbox" style={{ fontSize: '3rem', opacity: 0.5 }}></i>
            <h5 className="mt-3">No suppliers found</h5>
            <p className="text-muted">Start by adding your first supplier</p>
            <Link to="/create/Fournisseur" className="btn btn-primary mt-2">
              Add Supplier
            </Link>
          </div>
        </div>
      ) : (
        <div className="row row-cols-1 row-cols-md-2 g-4">
          {fournisseurs.map((fournisseur) => (
            <div key={fournisseur._id} className="col">
              <FournisseurItem 
                fournisseur={fournisseur} 
                onDelete={handleDelete} 
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FournisseurList;