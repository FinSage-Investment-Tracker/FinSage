// PortfolioLayout.js
import React from 'react';
import { Outlet, Navigate, useLocation, useParams } from 'react-router-dom';
import PortfolioTabs from './PortfolioTabs';
// import StockChart from './StockChart';

const PortfolioLayout = () => {
  const location = useLocation();
  const { portfolioId } = useParams();

  if (location.pathname === `/portfolio/${portfolioId}`) {
    return <Navigate to="stocks" replace />;
  }

  return (
    <div>
    {/* <StockChart/> */}
      <PortfolioTabs />
      <div className="content">
        <Outlet />
      </div>
    </div>
  );
};

export default PortfolioLayout;
