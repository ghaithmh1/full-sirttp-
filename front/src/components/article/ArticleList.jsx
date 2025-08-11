import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getArticles, deleteArticle } from '../../services/api';
import ArticleItem from './ArticleItem';

const ArticleList = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchArticles();
  }, []);

  const fetchArticles = async () => {
    try {
      setLoading(true);
      const { data } = await getArticles();
      setArticles(data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch articles');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this article?')) {
      try {
        await deleteArticle(id);
        fetchArticles();
      } catch (err) {
        console.error('Delete failed:', err);
        alert('Delete failed. Please try again.');
      }
    }
  };

  if (loading) return <div className="text-center my-4">Loading articles...</div>;
  if (error) return <div className="alert alert-danger my-4">{error}</div>;
  if (!articles.length) return <div className="alert alert-info my-4">No articles found</div>;

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Articles</h2>
        <Link to="/create" className="btn btn-primary">
          + Create Article
        </Link>
      </div>
      
      <div className="row">
        {articles.map((article) => (
          <div key={article._id} className="col-md-6 col-lg-4 mb-4">
            <ArticleItem article={article} onDelete={handleDelete} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ArticleList;