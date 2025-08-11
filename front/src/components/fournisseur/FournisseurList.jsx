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
      const { data } = await getFournisseurs();
      setFournisseurs(data.data || []); // Handle both array and object responses
      setError(null);
    } catch (err) {
      setError('Failed to load suppliers. Is the backend running?');
      console.error('Fetch error:', err);
      setFournisseurs([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this supplier?')) {
      try {
        await deleteFournisseur(id);
        fetchFournisseurs();
      } catch (err) {
        console.error('Delete failed:', err);
      }
    }
  };

  if (loading) return <div className="text-center my-4">Loading suppliers...</div>;
  if (error) return <div className="alert alert-danger my-4">{error}</div>;
  if (!fournisseurs.length) return <div className="alert alert-info my-4">No suppliers found</div>;

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>
          <i className="bi bi-truck me-2"></i>
          Suppliers
        </h2>
        <Link to="/create" className="btn btn-primary">
          <i className="bi bi-plus-lg me-2"></i>
          Add Supplier
        </Link>
      </div>

      <div className="row">
        {fournisseurs.map((fournisseur) => (
          <div key={fournisseur._id} className="col-md-6">
            <FournisseurItem 
              fournisseur={fournisseur} 
              onDelete={handleDelete} 
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default FournisseurList;