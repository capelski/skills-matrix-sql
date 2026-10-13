import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const navItems = [
  { path: '/', label: 'Home' },
  { path: '/employees', label: 'Employees' },
  { path: '/skills', label: 'Skills' },
  { path: '/matrix', label: 'Matrix' },
  { path: '/tables', label: 'Tables' },
];

const Header: React.FC = () => {
  const location = useLocation();

  const isActive = (path: string) =>
    path === '/' ? location.pathname === '/' : location.pathname.startsWith(path);

  return (
    <header className="header">
      <div className="header-content">
        <h1>
          <span className="brand-mark" aria-hidden="true">
            <span />
            <span />
            <span />
            <span />
          </span>
          <span className="brand-text">Skills Matrix</span>
        </h1>
        <nav className="nav">
          {navItems.map((item) => (
            <Link key={item.path} to={item.path} className={isActive(item.path) ? 'active' : ''}>
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
};

export default Header;
