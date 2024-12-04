import React, { useEffect, useRef } from 'react';

function TickerTapeWidget() {
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;

    const loadWidget = () => {
      if (!container) return;

      container.innerHTML = ''; // Clear any previous content

      const script = document.createElement('script');
      script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-ticker-tape.js';
      script.type = 'text/javascript';
      script.async = true;

      // Widget configuration
      const widgetConfig = {
        "symbols": [
          { "description": "SENSEX", "proName": "BSE:SENSEX" },
          { "description": "BANK", "proName": "BSE:BANK" },
          { "description": "MIDCAP", "proName": "BSE:MIDCAP" },
          { "description": "SMLCAP", "proName": "BSE:SMLCAP" },
          { "description": "TELCOM", "proName": "BSE:TELCOM" }
        ],
        "showSymbolLogo": true,
        "isTransparent": false,
        "displayMode": "adaptive",
        "colorTheme": "light",
        "locale": "en"
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
    <div className="tradingview-widget-container" ref={containerRef} style={{ width: '100%' }}>
      <div className="tradingview-widget-container__widget"></div>
      <div className="tradingview-widget-copyright">
        <a
          href="https://www.tradingview.com/"
          rel="noopener nofollow"
          target="_blank"
        >
          <span className="blue-text">Track all markets on TradingView</span>
        </a>
      </div>
    </div>
  );
}

export default TickerTapeWidget;