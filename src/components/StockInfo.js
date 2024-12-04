import React from 'react'
import CandleChart from './tradingview/CandleChart';
import SymbolInfo from './tradingview/SymbolInfo';
import CompanyProfile from './tradingview/CompanyProfile';
import Financials from './tradingview/Financials';
import Technicals from './tradingview/Technicals';

function StockInfo() {
    return (
        <div className="container mt-4" style={{ width: '100%' }}>
          <div style={{ width: '100%', height: '70vh' }}>
            <SymbolInfo/>
            <CandleChart />
            <CompanyProfile/>
            <Financials/>
            <Technicals/>
          </div>
        </div>
      );
}

export default StockInfo