// Navbar.jsx
import React from "react";
import "./Navbar.scss";

const Navbar = ({ onStockClick }) => (
  <nav className="navbar">
    <div className="navbar-container">
      <div className="menu-items">
        <span className="nav-link" onClick={onStockClick}>
          Stock
        </span>
      </div>
    </div>
  </nav>
);

export default Navbar;
