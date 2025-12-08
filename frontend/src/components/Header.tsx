import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Header: React.FC = () => {
  const location = useLocation();

  return (
    <header className="header">
      <div className="header-content">
        <h1>Skills Matrix</h1>
        <nav className="nav">
          <Link to="/" className={location.pathname === '/' ? 'active' : ''}>
            Home
          </Link>
          <Link to="/employees" className={location.pathname === '/employees' ? 'active' : ''}>
            Employees
          </Link>
          <Link to="/skills" className={location.pathname === '/skills' ? 'active' : ''}>
            Skills
          </Link>
          <Link to="/matrix" className={location.pathname === '/matrix' ? 'active' : ''}>
            Matrix
          </Link>
          <Link to="/tables" className={location.pathname === '/tables' ? 'active' : ''}>
            Tables
          </Link>
        </nav>
      </div>
    </header>
  );
};

export default Header;
