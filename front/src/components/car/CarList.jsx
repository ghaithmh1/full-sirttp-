import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getCars, deleteCar } from '../../services/carApi';
import CarItem from './CarItem';

const CarList = () => {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch cars on mount
  useEffect(() => {
    fetchCars();
  }, []);

  const fetchCars = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      if (!token) {
        setError('No authentication token found');
        setLoading(false);
        return;
      }

      const { data } = await getCars(token);
      // Backend sends: { success: true, data: [...] }
      setCars(data.data || []);
      setError(null);
    } catch (err) {
      console.error('Fetch error:', err);
      setError('Failed to load cars. Is the backend running?');
      setCars([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this car?')) {
      try {
        const token = localStorage.getItem('token');
        await deleteCar(id, token);
        fetchCars(); // refresh list after deletion
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
