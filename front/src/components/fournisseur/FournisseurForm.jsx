import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getFournisseur, createFournisseur, updateFournisseur } from '../../services/fournisseurApi';

const FournisseurForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
     entrepriseId: ''
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  useEffect(() => {


      const token = localStorage.getItem('token');
    if (!token) {
      alert('Please login first');
      navigate('/login');
      return;
    }
    
    // Set entrepriseId
    const storedId = localStorage.getItem("entrepriseId");
    if (storedId) {
      setFormData(prev => ({ ...prev, entrepriseId: storedId }));
    }
    
    if (isEdit) {
      fetchFournisseur();
    }
  }, [id]);

  const fetchFournisseur = async () => {
    setIsLoading(true);
    try {
      const { data } = await getFournisseur(id);
      setFormData(data.data);
      setErrors({});
    } catch (err) {
      console.error('Error fetching supplier:', err);
      setErrors({ 
        general: err.response?.data?.message || 'Failed to load supplier details' 
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email is invalid';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsLoading(true);
    try {
      if (isEdit) {
        await updateFournisseur(id, formData);
      } else {
        await createFournisseur(formData);
      }
      navigate('/Fournisseur');
    } catch (err) {
      console.error('Error saving supplier:', err);
      
      // Handle backend validation errors
      if (err.response?.data?.errors) {
        const backendErrors = {};
        err.response.data.errors.forEach(error => {
          backendErrors[error.path] = error.msg;
        });
        setErrors(backendErrors);
      } else {
        setErrors({ 
          general: err.response?.data?.message || 'An error occurred. Please try again.' 
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mt-4">
      <h2>{isEdit ? 'Edit Supplier' : 'Add Supplier'}</h2>
      
      {errors.general && (
        <div className="alert alert-danger">{errors.general}</div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Name *</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className={`form-control ${errors.name ? 'is-invalid' : ''}`}
            disabled={isLoading}
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
            disabled={isLoading}
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
            disabled={isLoading}
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
            disabled={isLoading}
          />
        </div>

        <div className="d-flex gap-2">
          <button 
            type="submit" 
            className="btn btn-primary"
            disabled={isLoading}
          >
            {isLoading ? (
              <span className="spinner-border spinner-border-sm me-1" role="status" aria-hidden="true"></span>
            ) : null}
            {isEdit ? 'Update' : 'Create'}
          </button>
          
          <button 
            type="button" 
            className="btn btn-secondary"
            onClick={() => navigate('/Fournisseur')}
            disabled={isLoading}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default FournisseurForm;