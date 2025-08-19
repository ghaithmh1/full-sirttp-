import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getArticle, createArticle, updateArticle } from '../../services/api';

const ArticleForm = () => {
  const [formData, setFormData] = useState({ name: '', model: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  useEffect(() => {
    if (isEdit) {
      fetchArticle();
    }
  }, [id, isEdit]);

  const fetchArticle = async () => {
    try {
      setLoading(true);
      setError('');
      const { data } = await getArticle(id);
      
      // Ensure we only take the fields we need
      setFormData({
        name: data.data.name,
        model: data.data.model
      });
    } catch (err) {
      setError('Failed to load article: ' + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form inputs
    if (!formData.name.trim()) {
      setError('Name is required');
      return;
    }
    
    if (!formData.model.trim()) {
      setError('Model is required');
      return;
    }
    
    setLoading(true);
    setError('');

    try {
      if (isEdit) {
        // Only send the fields that can be updated
        await updateArticle(id, {
          name: formData.name,
          model: formData.model
        });
      } else {
        await createArticle({
          name: formData.name,
          model: formData.model
        });
      }
      navigate('/article');
    } catch (err) {
      // Handle different error formats
      const errorMessage = err.response?.data?.message || 
                           err.response?.data?.error || 
                           err.message || 
                           'Operation failed';
      
      setError(`Error: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-4">
      <h2 className="mb-4">{isEdit ? 'Edit Article' : 'Create New Article'}</h2>

      {error && (
        <div className="alert alert-danger mb-4">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Name *</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="form-control"
            required
            placeholder="Enter article name"
            disabled={loading}
          />
        </div>
        
        <div className="mb-4">
          <label className="form-label">Model *</label>
          <input
            type="text"
            name="model"
            value={formData.model}
            onChange={handleChange}
            className="form-control"
            required
            placeholder="Enter model number"
            disabled={loading}
          />
        </div>
        
        <div className="d-flex gap-2">
          <button
            type="submit"
            className="btn btn-primary"
            disabled={loading}
          >
            {loading && (
              <span 
                className="spinner-border spinner-border-sm me-2" 
                role="status" 
                aria-hidden="true"
              ></span>
            )}
            {isEdit ? 'Update Article' : 'Create Article'}
          </button>
          
          <button
            type="button"
            className="btn btn-outline-secondary"
            onClick={() => navigate('/article')}
            disabled={loading}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default ArticleForm;