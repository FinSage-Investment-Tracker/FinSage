import React, { useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';

function Financials() {
  const containerRef = useRef(null);
  const { symbol: routeSymbol } = useParams();
  const symbol = routeSymbol || "TATASTEEL";
  useEffect(() => {
    // Store the current reference in a variable
    const container = containerRef.current;

    const loadWidget = () => {
      if (!container) return;
      container.innerHTML = ''; // Clear any previous content

      const script = document.createElement('script');
      script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-financials.js';
      script.type = 'text/javascript';
      script.async = true;

      const widgetConfig = {
        "isTransparent": false,
        "largeChartUrl": "",
        "displayMode": "regular",
        "width": "100%",
        "height": "100%",
        "colorTheme": "light",
        "symbol": `BSE:${symbol}`,
        "locale": "en"
      };

      script.innerHTML = JSON.stringify(widgetConfig);
      container.appendChild(script);
    };

    const timeoutId = setTimeout(loadWidget, 100);

    return () => {
      clearTimeout(timeoutId);
      if (container) {
        container.innerHTML = ''; // Cleanup on unmount
      }
    };
  }, []); // The empty dependency array ensures the effect runs once on mount and cleanup on unmount.

  return (
    <div className="tradingview-widget-container" style={{ height: '70vh', width: '100%' }}>
      <div ref={containerRef} style={{ height: '100%', width: '100%' }} />
      <div style={{ textAlign: 'center', marginTop: '10px' }}>
      </div>
    </div>
  );
}

export default Financials;