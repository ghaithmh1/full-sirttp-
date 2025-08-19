import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getArticlesForCurrentEntreprise, deleteArticle } from '../../services/api';
import ArticleItem from './ArticleItem';

const ArticleList = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    fetchArticles();
  }, []);

  const fetchArticles = async () => {
    try {
      setLoading(true);
      setError('');
      const { data } = await getArticlesForCurrentEntreprise();
      setArticles(data.data || []);
    } catch (err) {
      setError('Failed to load articles: ' + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this article?')) return;
    
    try {
      setDeletingId(id);
      await deleteArticle(id);
      fetchArticles();
    } catch (err) {
      setError('Delete failed: ' + (err.response?.data?.message || err.message));
    } finally {
      setDeletingId(null);
    }
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center my-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mt-4">
        <div className="alert alert-danger">{error}</div>
        <button className="btn btn-primary" onClick={fetchArticles}>
          Retry
        </button>
      </div>
    );
  }

  if (!articles.length) {
    return (
      <div className="container mt-4">
        <div className="card">
          <div className="card-body text-center py-5">
            <i className="bi bi-inbox" style={{ fontSize: '3rem', opacity: 0.5 }}></i>
            <h5 className="mt-3">No articles found</h5>
            <p className="text-muted">Start by adding your first article</p>
            <Link to="/createArticle" className="btn btn-primary mt-2">
              Create Article
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Articles</h2>
        <Link to="/createArticle" className="btn btn-primary">
          + Create Article
        </Link>
      </div>
      
      <div className="row">
        {articles.map((article) => (
          <div key={article._id} className="col-md-6 col-lg-4 mb-4">
            <ArticleItem 
              article={article} 
              onDelete={handleDelete} 
              isDeleting={deletingId === article._id} 
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ArticleList;