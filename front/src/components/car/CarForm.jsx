import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getCar, createCar, updateCar } from '../../services/carApi';

const CarForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    model: '',
    serie: '',
    registrationCard: '',
    insurance: '',
    mileage: '',
    lastServiceDate: '',
    nextServiceDue: ''
  });
  
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);
    useEffect(() => {
    // Récupérer l'ID stocké dans localStorage et l'ajouter à formData
    const storedId = localStorage.getItem("entrepriseId");
    if (storedId) {
      setFormData(prev => ({ ...prev, entrepriseId: storedId }));
    }
  }, []);

  useEffect(() => {
    if (isEdit) {
      fetchCar();
    }
  }, [id]);

  const fetchCar = async () => {
    try {
      const { data } = await getCar(id);
      setFormData({ ...data, entrepriseId: data.entrepriseId || '' });
    } catch (err) {
      console.error('Error fetching car:', err);
    }
  };

  const validate = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.model.trim()) newErrors.model = 'Model is required';
    if (!formData.serie.trim()) newErrors.serie = 'Serie is required';
    if (!formData.registrationCard.trim()) newErrors.registrationCard = 'Registration card is required';
    if (!formData.insurance.trim()) newErrors.insurance = 'Insurance is required';
    if (!formData.mileage) {
      newErrors.mileage = 'Mileage is required';
    } else if (isNaN(formData.mileage)) {
      newErrors.mileage = 'Mileage must be a number';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error when field changes
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validate()) return;
    
    setIsSubmitting(true);
    
    try {
      const payload = {
        ...formData,
        mileage: Number(formData.mileage)
      };
      
      if (isEdit) {
        await updateCar(id, payload);
      } else {
        await createCar(payload);
      }
      navigate('/car');
    } catch (err) {
      console.error('Error saving car:', err);
      if (err.response?.data?.errors) {
        setErrors(err.response.data.errors);
      } else {
        alert(err.response?.data?.message || 'Failed to save car');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mt-4">
      <h2>{isEdit ? 'Edit Car' : 'Add New Car'}</h2>
      <form onSubmit={handleSubmit}>
        {/* Name Field */}
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
        
        {/* Model Field */}
        <div className="mb-3">
          <label className="form-label">Model *</label>
          <input
            type="text"
            name="model"
            value={formData.model}
            onChange={handleChange}
            className={`form-control ${errors.model ? 'is-invalid' : ''}`}
            required
          />
          {errors.model && <div className="invalid-feedback">{errors.model}</div>}
        </div>
        
        {/* Serie Field */}
        <div className="mb-3">
          <label className="form-label">Serie *</label>
          <input
            type="text"
            name="serie"
            value={formData.serie}
            onChange={handleChange}
            className={`form-control ${errors.serie ? 'is-invalid' : ''}`}
            required
          />
          {errors.serie && <div className="invalid-feedback">{errors.serie}</div>}
        </div>
        
        {/* Registration Card Field */}
        <div className="mb-3">
          <label className="form-label">Registration Card *</label>
          <input
            type="text"
            name="registrationCard"
            value={formData.registrationCard}
            onChange={handleChange}
            className={`form-control ${errors.registrationCard ? 'is-invalid' : ''}`}
            required
          />
          {errors.registrationCard && <div className="invalid-feedback">{errors.registrationCard}</div>}
        </div>
        
        {/* Insurance Field */}
        <div className="mb-3">
          <label className="form-label">Insurance *</label>
          <input
            type="text"
            name="insurance"
            value={formData.insurance}
            onChange={handleChange}
            className={`form-control ${errors.insurance ? 'is-invalid' : ''}`}
            required
          />
          {errors.insurance && <div className="invalid-feedback">{errors.insurance}</div>}
        </div>
        
        {/* Mileage Field */}
        <div className="mb-3">
          <label className="form-label">Mileage (km) *</label>
          <input
            type="number"
            name="mileage"
            value={formData.mileage}
            onChange={handleChange}
            className={`form-control ${errors.mileage ? 'is-invalid' : ''}`}
            required
            min="0"
          />
          {errors.mileage && <div className="invalid-feedback">{errors.mileage}</div>}
        </div>
        
        <div className="d-flex gap-2">
          <button 
            type="submit" 
            className="btn btn-primary"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Saving...' : isEdit ? 'Update' : 'Create'}
          </button>
          <button 
            type="button" 
            className="btn btn-outline-secondary"
            onClick={() => navigate('/car')}
            disabled={isSubmitting}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default CarForm;