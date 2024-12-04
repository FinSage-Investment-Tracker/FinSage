import React from 'react';
import CandleChart from './tradingview/CandleChart';
import TopMovers from './tradingview/TopMovers';
import MarketQuotesWidget from './tradingview/MarketQuotes';
import HeatMap from './tradingview/HeatMap';
import Screener from './tradingview/Screener';
import TickerTapeWidget from './tradingview/TickerTape';

const Home = () => {
  return (
    <div className="container mt-4" style={{ width: '100%' }}>
      {/* Ticker Tape */}
      <div style={{ width: '100%' }}>
        <TickerTapeWidget />
      </div>

      {/* HeatMap */}
      <div style={{ width: '100%', height: '70vh' }}>
        <HeatMap />
      </div>

      {/* Screener and Top Movers */}
      <div
        style={{
          display: 'flex',
          gap: '1em',
          marginTop: '2em',
          alignItems: 'flex-start',
        }}
      >
        <div style={{ flex: '3', height: '70vh' }}>
          <Screener />
        </div>
        <div style={{ flex: '1' }}>
          <p style={{ textAlign: 'center' }}>Top Movers</p>
          <TopMovers />
        </div>
      </div>

      {/* Market Quotes */}
      <div style={{ width: '100%', height: '50vh', marginTop: '2em' }}>
        <MarketQuotesWidget />
      </div>

      {/* Candle Chart */}
      <div style={{ width: '100%', height: '70vh', marginTop: '2em' }}>
        <CandleChart />
      </div>
    </div>
  );
};

export default Home;