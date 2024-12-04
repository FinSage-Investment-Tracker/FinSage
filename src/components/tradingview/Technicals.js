import React, { useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';

function Technicals() {
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
      script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-technical-analysis.js';
      script.async = true;
      script.type = 'text/javascript';
      const isLocal = window.location.hostname === 'localhost';
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
      if (isLocal) {
        widgetConfig.disabledFeatures = ["use_websocket"];
      }
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
  }, []); 

  return (
    <div 
    className="tradingview-widget-container" 
    style={{ height: '70vh', width: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}
  >
    <div 
      ref={containerRef} 
      style={{ flexGrow: 1, width: '100%' }} 
    />
  </div>
  );
}

export default Technicals;