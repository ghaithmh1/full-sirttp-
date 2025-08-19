import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getFournisseur, createFournisseur, updateFournisseur } from '../../services/fournisseurApi';

const FournisseurForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: ''
  });
  const [errors, setErrors] = useState({});
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  useEffect(() => {
    if (isEdit) {
      fetchFournisseur();
    }
  }, [id]);

  const fetchFournisseur = async () => {
    try {
      const { data } = await getFournisseur(id);
      setFormData(data.data); // Adjust based on your API response
    } catch (err) {
      console.error('Error fetching supplier:', err);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      if (isEdit) {
        await updateFournisseur(id, formData);
      } else {
        await createFournisseur(formData);
      }
      navigate('/Fournisseur');
    } catch (err) {
      console.error('Error saving supplier:', err);
      if (err.response?.data?.errors) {
        setErrors(err.response.data.errors);
      }
    }
  };

  return (
    <div className="container mt-4">
      <h2>{isEdit ? 'Edit Supplier' : 'Add Supplier'}</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Name *</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className={`form-control ${errors.name ? 'is-invalid' : ''}`}
            required
          />
          {errors.name && <div className="invalid-feedback">{errors.name}</div>}
        </div>

        <div className="mb-3">
          <label className="form-label">Email *</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className={`form-control ${errors.email ? 'is-invalid' : ''}`}
            required
          />
          {errors.email && <div className="invalid-feedback">{errors.email}</div>}
        </div>

        <div className="mb-3">
          <label className="form-label">Phone</label>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className="form-control"
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Address</label>
          <textarea
            name="address"
            value={formData.address}
            onChange={handleChange}
            className="form-control"
            rows="3"
          />
        </div>

        <button type="submit" className="btn btn-primary me-2">
          {isEdit ? 'Update' : 'Create'}
        </button>
        <button 
          type="button" 
          className="btn btn-secondary"
          onClick={() => navigate('/Fournisseur')}
        >
          Cancel
        </button>
      </form>
    </div>
  );
};

export default FournisseurForm;