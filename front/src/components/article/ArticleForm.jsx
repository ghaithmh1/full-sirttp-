import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getArticle, createArticle, updateArticle } from '../../services/api';

const ArticleForm = () => {
  const [formData, setFormData] = useState({ name: '', model: '', entrepriseId: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  useEffect(() => {
  if (!isEdit) {
    const storedId = localStorage.getItem("entrepriseId");
    if (storedId) {
      setFormData(prev => ({ ...prev, entrepriseId: storedId }));
    }
  }
}, [isEdit]);


useEffect(() => {
  if (isEdit) {
    fetchArticle();
  }
}, [id, isEdit]);


  const fetchArticle = async () => {
    try {
      setLoading(true);
      const { data } = await getArticle(id);
      
      setFormData({ ...data, entrepriseId: data.entrepriseId || '' });
      setError('');
    } catch (err) {
      setError('Failed to load article');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isEdit) {
        await updateArticle(id, formData);
      } else {
        console.log(formData);
        await createArticle(formData);
        
      }
      navigate('/article');
    } catch (err) {
      setError(`Operation failed: ${err.response?.data?.message || err.message}`);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-4">
      <h2 className="mb-4">{isEdit ? 'Edit Article' : 'Create New Article'}</h2>

      {error && <div className="alert alert-danger mb-4">{error}</div>}

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
          />
        </div>
        <div className="d-flex gap-2">
          <button
            type="submit"
            className="btn btn-primary"
            disabled={loading}
          >
            {loading ? (
              <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
            ) : isEdit ? (
              'Update Article'
            ) : (
              'Create Article'
            )}
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
