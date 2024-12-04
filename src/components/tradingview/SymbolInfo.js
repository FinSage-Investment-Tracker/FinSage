import React, { useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';

function SymbolInfo() {
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
      script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-symbol-info.js';
      script.type = 'text/javascript';
      script.async = true;

      const widgetConfig = {
        "symbol": `BSE:${symbol}`,
        "locale": "en",
        "colorTheme": "light",
        "isTransparent": false
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
    <div className="tradingview-widget-container" style={{ width: '100%' }}>
      <div ref={containerRef} className="tradingview-widget-container__widget" style={{ width: '100%' }} />
      <div className="tradingview-widget-copyright">
        <a href="https://www.tradingview.com/" rel="noopener nofollow" target="_blank">
        </a>
      </div>
    </div>
  );
}

export default SymbolInfo;