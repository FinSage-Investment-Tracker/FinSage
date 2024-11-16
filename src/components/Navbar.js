import React, { useContext, useEffect, useState } from 'react'
import { Link, useNavigate } from "react-router-dom";
import { PortfolioContext } from '../context/PortfolioContext';
import { UserContext } from '../context/UserContext';

const Navbar = () => {

  const context = useContext(PortfolioContext);
  const { portfolios, fetchallPortfolios } = context;
  const { details, fetchUserDetails } = useContext(UserContext);

  useEffect(() => {
    if(localStorage.getItem('token')){
        fetchallPortfolios();
        fetchUserDetails();
    }
    else{
        navigate("/login");
    }
    // eslint-disable-next-line
}, [])

  let navigate = useNavigate();
  const handleLogout =() =>{
    localStorage.removeItem('token');
    navigate("/login");
  }

  const [showProfileCard, setShowProfileCard] = useState(false);

  const handleMouseEnter = () => {
    setShowProfileCard(true);
  };

  const handleMouseLeave = () => {
    setTimeout(() => {
      setShowProfileCard(false);
    }, 3000);
  };

  return (
    <div>
      <nav className="navbar navbar-expand-lg bg-body-tertiary">
        <div className="container-fluid">
          <Link className="navbar-brand" to="/">CapitaWise</Link>
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item dropdown">
                <Link className="nav-link dropdown-toggle" to="/portfoliolist" role="button" aria-expanded="false">
                  Portfolios
                </Link>
                <ul className="dropdown-menu">
                {portfolios.length > 0 ? (
                portfolios.map((item)=>{
                  return <li  key={item._id}><Link className="dropdown-item" to={`/portfolio/${item._id}`}>{item.name}</Link></li>
                })) : (
                  <li><span className="dropdown-item text-muted">No Portfolios</span></li>
                )}
                </ul>
              </li>
              <li className="nav-item">
                <Link className="nav-link" aria-current="page" to="/news">News</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" aria-current="page" to="ipo">IPOs</Link>
              </li>
              <li className="nav-item dropdown">
                <li className="nav-link dropdown-toggle">more</li>
                <ul className="dropdown-menu">
                  <li><Link className="dropdown-item" to='/sipcalculator'>SIP Calculator</Link></li>
                  <li><Link className="dropdown-item" to='/swpcalculator'>SWP Calculator</Link></li>
                </ul>
              </li>
            </ul>
            {!localStorage.getItem("token") ? (
              <form>
                <Link className="btn btn-primary mx-1" to="/signup" role="button">
                  Signup
                </Link>
                <Link className="btn btn-primary mx-1" to="/login" role="button">
                  Login
                </Link>
              </form>
            ) : (
              <div className="d-flex align-items-center">
                <div className="position-relative" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} >
                <button
                    className="btn btn-outline-secondary rounded-circle"
                    style={{ width: "40px", height: "40px" }}
                  >
                    <i className="fa-regular fa-user"></i>
                  </button>
                  {showProfileCard && (
                    <div
                      className="position-absolute bg-white shadow rounded p-3"
                      style={{
                        top: "50px",
                        right: 0,
                        zIndex: 1000,
                        borderRadius: "8px",
                        transition: "opacity 0.3s ease",
                        opacity: showProfileCard ? 1 : 0, // Smooth fade-in/out
                      }}
                    >
                      <h6 className="mb-1">{details.name}</h6>
                      <p className="mb-0 text-muted" style={{ fontSize: "0.75rem" }} >{details.email}</p>
                      <button
                        onClick={handleLogout}
                        className="btn btn-primary my-3 w-100"
                      >
                        Logout <i className="fa-solid fa-arrow-right-from-bracket"></i>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </nav>
    </div>
  );
};

export default Navbar;
