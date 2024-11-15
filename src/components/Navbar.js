import React, { useContext, useEffect } from 'react'
import { Link, useNavigate } from "react-router-dom";
import { PortfolioContext } from '../context/PortfolioContext';

const Navbar = () => {

  const context = useContext(PortfolioContext);
  const { portfolios, fetchallPortfolios } = context;

  useEffect(() => {
    if(localStorage.getItem('token')){
        fetchallPortfolios();
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
              <li className="nav-item">
                <Link className="nav-link" aria-current="page" to="#">more dropdown</Link>
              </li>
            </ul>
            {!localStorage.getItem('token')?<form>
              <Link className='btn btn-primary mx-1' to="/signup" role="button" >Signup</Link>
              <Link className='btn btn-primary mx-1' to="/login" role="button" >Login</Link>
            </form>: <button onClick={handleLogout} className='btn btn-primary'>Logout</button>}
          </div>
        </div>
      </nav>
    </div>
  );
};

export default Navbar;
