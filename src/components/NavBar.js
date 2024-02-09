import React from 'react';
import { Link } from 'react-router-dom';
import './NavBar.css';


const NavBar = () => {
  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <h1>giv3</h1>
        {/* Insert your logo below */}
        {/*<img src="/path-to-your-logo.png" alt="Logo" />*/}
      </div>
      <div className="navbar-links">
        <Link to="/" className="nav-item">Home</Link>
        <Link to="/About" className="nav-item">About</Link>
        <Link to="/Campaigns" className="nav-item">Campaigns</Link>
        <Link to="/Create" className="nav-item">Create</Link>
      </div>
    </nav>
  );
};

export default NavBar;
