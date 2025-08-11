import React from 'react';
import { Link } from 'react-router-dom';

const FournisseurItem = ({ fournisseur, onDelete }) => {
  return (
    <div className="card mb-3">
      <div className="card-body">
        <div className="d-flex justify-content-between align-items-start">
          <div>
            <h5 className="card-title mb-2">
              <i className="bi bi-building me-2"></i>
              {fournisseur.name}
            </h5>
            
            <div className="mb-2">
              <i className="bi bi-envelope me-2"></i>
              <a href={`mailto:${fournisseur.email}`}>{fournisseur.email}</a>
            </div>
            
            {fournisseur.phone && (
              <div className="mb-2">
                <i className="bi bi-telephone me-2"></i>
                <a href={`tel:${fournisseur.phone}`}>{fournisseur.phone}</a>
              </div>
            )}
            
            {fournisseur.address && (
              <div>
                <i className="bi bi-geo-alt me-2"></i>
                <span className="text-muted">{fournisseur.address}</span>
              </div>
            )}
          </div>
          
          <div className="d-flex flex-column gap-2">
            <Link
              to={`/editFournisseur/${fournisseur._id}`}
              className="btn btn-sm btn-outline-primary"
            >
              <i className="bi bi-pencil"></i> Edit
            </Link>



            <button
              onClick={() => onDelete(fournisseur._id)}
              className="btn btn-sm btn-outline-danger"
            >
              <i className="bi bi-trash"></i> Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FournisseurItem;