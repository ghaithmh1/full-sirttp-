import React, { useEffect, useState } from 'react';
      import { Link } from 'react-router-dom';

const Navbar = () => {
  const [userId, setUserId] = useState(null);
  const [entrepriseId, setEntrepriseId] = useState(null);
  const [token, setToken] = useState(null);

  useEffect(() => {
    const storedToken = localStorage.getItem('token') || "no token";
    const storedUserId = localStorage.getItem('userId')  || "no user id " ;
    const storedEntrepriseId = localStorage.getItem('entrepriseId')|| "no entreprise id " ;

    setToken(storedToken);
    setUserId(storedUserId);
    setEntrepriseId(storedEntrepriseId);
  }, []);

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light px-3">
      <a className="navbar-brand" href="/">My App</a>
      <div className="ms-auto">
        <span className="me-3">
          <strong>Token:</strong> {token ? token.slice(0, 10) + '...' : 'Not logged in'}
        </span>
        <span className="me-3">
          <strong>User ID:</strong> {userId || 'N/A'}
        </span>
        <span>
          <strong>Entreprise ID:</strong> {entrepriseId || 'N/A'}
        </span>
      </div>
          <Link to="/car"> <button>Car</button></Link>
          
          <Link to="/clients"> <button>Client</button> </Link>
          
          <Link to="/Fournisseur"><button>Fournisseur</button></Link>
          
          <Link to="/sousTraitants"><button>Sous-traitanlist</button></Link>
          
          <Link to="/Article"><button>Article</button></Link>
    </nav>
  );
};

export default Navbar;
