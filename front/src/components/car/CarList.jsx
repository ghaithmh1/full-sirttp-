import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getCarsByEntrepriseId, deleteCar } from '../../services/carApi';
import CarItem from './CarItem';

const CarList = () => {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [entrepriseId, setEntrepriseId] = useState(null);

    useEffect(() => {
    const storedId = localStorage.getItem("entrepriseId");
    if (storedId) {
      setEntrepriseId(storedId);
    } else {
      setError('Entreprise ID not found in localStorage');
      setLoading(false);
    }
  }, []);
    useEffect(() => {
    if (entrepriseId) {
      fetchCars(entrepriseId);
    }
  }, [entrepriseId]);


  const fetchCars = async (id) => {
    try {
      setLoading(true);
      const { data } = await getCarsByEntrepriseId(id); // Direct array response
      setCars(data);
      setError(null);
    } catch (err) {
      setError('Failed to load cars. Is the backend running?');
      console.error('Fetch error:', err);
      setCars([]); // Ensure cars is always an array
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this car?')) {
      try {
        await deleteCar(id);
        fetchCars();
      } catch (err) {
        console.error('Delete failed:', err);
      }
    }
  };

  if (loading) return <div className="text-center my-4">Loading cars...</div>;
  if (error) return <div className="alert alert-danger my-4">{error}</div>;
  if (!cars.length) return <div className="alert alert-info my-4">No cars found</div>;

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Car Inventory</h2>
        <Link to="/createCar" className="btn btn-primary">
          + Add New Car
        </Link>
      </div>

      <div className="row">
        {cars.map((car) => (
          <div key={car._id} className="col-md-6 col-lg-4 mb-4">
            <CarItem car={car} onDelete={handleDelete} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default CarList;