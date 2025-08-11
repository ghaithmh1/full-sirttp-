import React from 'react';
import { Link } from 'react-router-dom';

const CarItem = ({ car, onDelete }) => {
  return (
    <div className="card mb-3">
      <div className="card-body">
        <div className="d-flex justify-content-between align-items-start">
          <div>
            <h5 className="card-title">
              {car.name} {car.model}
            </h5>
            <p className="card-text mb-1">
              <strong>Serie:</strong> {car.serie}
            </p>
            <p className="card-text mb-1">
              <strong>Registration:</strong> {car.registrationCard}
            </p>
            <p className="card-text mb-1">
              <strong>Mileage:</strong> {car.mileage.toLocaleString()} km
            </p>
            {car.lastServiceDate && (
              <p className="card-text mb-1 text-muted">
                <small>
                  Last serviced: {new Date(car.lastServiceDate).toLocaleDateString()}
                </small>
              </p>
            )}
          </div>
          <div className="d-flex flex-column gap-2">
            <Link
              to={`/editCar/${car._id}`}
              className="btn btn-sm btn-outline-primary"
            >
              Edit
            </Link>

            
            <button
              onClick={() => onDelete(car._id)}
              className="btn btn-sm btn-outline-danger"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CarItem;