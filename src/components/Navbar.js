import React, { useState, useEffect } from 'react';
import { Link } from "react-router-dom";
import axios from 'axios';

const Navbar = () => {
  const [portfolios, setPortfolios] = useState([]);

  // Fetch portfolios from the server when the component mounts
  useEffect(() => {
    const fetchPortfolios = async () => {
      try {
        const response = await axios.get('/api/portfolio/fetchallportfolios'); // Adjust the API endpoint as needed
        setPortfolios(response.data);
      } catch (error) {
        console.error('Error fetching portfolios:', error);
      }
    };

    fetchPortfolios();
  }, []);

  return (
    <div>
      <nav className="navbar navbar-expand-lg bg-body-tertiary">
        <div className="container-fluid">
          <Link className="navbar-brand" to="/">Navbar</Link>
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
              <li className="nav-item">
                <Link className="nav-link active" aria-current="page" to="/">Home</Link>
              </li>
              <li className="nav-item dropdown">
                <Link className="nav-link dropdown-toggle" to="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                  Portfolio
                </Link>
                <ul className="dropdown-menu">
                  {portfolios.length > 0 ? (
                    portfolios.map((portfolio) => (
                      <li key={portfolio._id}>
                        <Link className="dropdown-item" to={`/portfolio/${portfolio._id}`}>{portfolio.name}</Link>
                      </li>
                    ))
                  ) : (
                    <li>
                      <span className="dropdown-item text-muted">No Portfolios</span>
                    </li>
                  )}
                  <li><hr className="dropdown-divider" /></li>
                  <li>
                    <Link className="dropdown-item" to="/portfolio/manage">Manage Portfolios</Link>
                  </li>
                </ul>
              </li>
              <li className="nav-item">
                <Link className="nav-link active" aria-current="page" to="/about">About</Link>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </div>
  );
};

export default Navbar;
