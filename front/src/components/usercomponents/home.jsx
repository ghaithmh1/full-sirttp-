import React, { useEffect, useState } from "react";


const Home = () => {
  const [entrepriseId, setEntrepriseId] = useState("");

  useEffect(() => {
    // Récupérer l'ID stocké dans localStorage
    const storedId = localStorage.getItem("entrepriseId");

    if (storedId) {
      setEntrepriseId(storedId);
    }
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <h1>Page d'accueil</h1>
      {entrepriseId ? (
        <div>
          <p>ID de l'entreprise : <strong>{entrepriseId}</strong></p>
          
          
        </div>
      ) : (
        <p>Aucun ID d'entreprise trouvé dans le localStorage.</p>
      )}
    </div>
  );
};

export default Home;
