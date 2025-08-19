import React from 'react';
import { Link } from 'react-router-dom';

const ArticleItem = ({ article, onDelete, isDeleting }) => {
  return (
    <div className="card mb-3">
      <div className="card-body">
        <h5 className="card-title">{article.name}</h5>
        <p className="card-text">
          <strong>Model:</strong> {article.model}
        </p>
        <div className="d-flex justify-content-end gap-2">
          <Link 
            to={`/editArticle/${article._id}`} 
            className="btn btn-sm btn-outline-primary"
          >
            Edit
          </Link>
          <button
            onClick={() => onDelete(article._id)}
            className="btn btn-sm btn-outline-danger"
            disabled={isDeleting}
          >
            {isDeleting ? (
              <span className="spinner-border spinner-border-sm me-1" role="status" aria-hidden="true"></span>
            ) : null}
            {isDeleting ? 'Deleting...' : 'Delete'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ArticleItem;