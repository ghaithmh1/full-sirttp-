import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Navbar from "./components/navbar/Navbar";
import Listestock from "./components/stock/Listestock";
import AjouterProduit from "./components/stock/AjouterProduit";
import StockSidebar from "./components/stock/StockSidebar";
import './Admin.scss';
function AdminApp() {
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedContent, setSelectedContent] = useState(null);

  const showSidebar = location.pathname.startsWith("/admin/stock");

  useEffect(() => {
    if (location.pathname.endsWith("/ajouter")) setSelectedContent("ajouter");
    else if (location.pathname.endsWith("/produits")) setSelectedContent("produits");
    else setSelectedContent(null);
  }, [location.pathname]);

  const handleStockClick = () => {
    if (!showSidebar) navigate("/admin/stock/produits"); // URL par défaut
  };

  const handleSidebarSelect = (section) => {
    setSelectedContent(section);
    navigate(`/admin/stock/${section}`);
  };

  const renderContent = () => {
    if (selectedContent === "produits") return <Listestock />;
    if (selectedContent === "ajouter") return <AjouterProduit />;
    return null;
  };

  return (
    <div className="Admin-app">
      {/* Navbar en haut */}
      <div className="Admin-navbar">
        <Navbar onStockClick={handleStockClick} />
      </div>

      {/* Layout sidebar + contenu à côté */}
      <div className="Admin-layout">
        {showSidebar && (
          <StockSidebar onSelect={handleSidebarSelect} selected={selectedContent} />
        )}
        <div className="Admin-app-main-content">{renderContent()}</div>
      </div>
    </div>
  );
}

export default AdminApp;
