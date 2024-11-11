// PortfolioTabs.js
import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const PortfolioTabs = () => {
  const location = useLocation();

  return (
    <ul className="nav nav-tabs">
      <li className="nav-item">
        <Link className={`nav-link ${location.pathname.includes('/stocks') ? 'active' : ''}`} to="stocks">Stocks</Link>
      </li>
      <li className="nav-item">
        <Link className={`nav-link ${location.pathname.includes('/mutualfunds') ? 'active' : ''}`} to="mutualfunds">Mutual Funds</Link>
      </li>
      <li className="nav-item">
        <Link className={`nav-link ${location.pathname.includes('/fixeddeposit') ? 'active' : ''}`} to="fixeddeposit">Fixed Deposit</Link>
      </li>
      <li className="nav-item">
        <Link className={`nav-link ${location.pathname.includes('/gold') ? 'active' : ''}`} to="gold">Gold</Link>
      </li>
    </ul>
  );
};

export default PortfolioTabs;
