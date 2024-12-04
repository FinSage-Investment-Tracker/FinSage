import React, { useEffect, useRef } from 'react';

function MarketQuotesWidget() {
  const containerRef = useRef(null);

  useEffect(() => {
    // Function to load the TradingView widget script
    const loadWidget = () => {
      if (!containerRef.current) return;

      // Clear previous content before appending the script
      containerRef.current.innerHTML = '';

      // Check if script is already added
      const existingScript = document.getElementById('tradingview-market-quotes');
      if (existingScript) {
        return; // If script exists, don't append it again
      }

      const script = document.createElement('script');
      script.id = 'tradingview-market-quotes'; // Adding a unique ID for future reference
      script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-market-quotes.js';
      script.type = 'text/javascript';
      script.async = true;

      // Configuration for the widget
      const widgetConfig = {
        "width": "100%",
        "height": "100%",
        "symbolsGroups": [
          {
            "name": "Indices",
            "originalName": "Indices",
            "symbols": [
              { "name": "BSE:SENSEX", "displayName": "SENSEX" },
              { "name": "BSE:MIDCAP", "displayName": "MIDCAP" },
              { "name": "BSE:SMLCAP", "displayName": "SMLCAP" },
              { "name": "BSE:POWER", "displayName": "POWER" },
              { "name": "BSE:TELCOM", "displayName": "TELCOM" },
              { "name": "BSE:ENERGY", "displayName": "ENERGY" }
            ]
          },
          {
            "name": "Bonds",
            "originalName": "Bonds",
            "symbols": [
              { "name": "BSE:SGBFEB32IV", "displayName": "SGBFEB32IV" },
              { "name": "BSE:762NTPC35F", "displayName": "762NTPC35F" }
            ]
          }
        ],
        "showSymbolLogo": true,
        "isTransparent": false,
        "colorTheme": "light",
        "locale": "en",
        "backgroundColor": "#ffffff"
      };

      // Add widget configuration as the inner HTML of the script
      script.innerHTML = JSON.stringify(widgetConfig);

      // Error handling if the script fails to load
      script.onerror = (error) => {
        console.error("Error loading TradingView widget script:", error);
      };

      // Attach script to the containerRef element
      try {
        containerRef.current.appendChild(script);
      } catch (error) {
        console.error("Error appending script to the container:", error);
      }
    };

    // Call the loadWidget function after a slight delay
    const timeoutId = setTimeout(loadWidget, 100);

    // Cleanup when component unmounts
    return () => {
      clearTimeout(timeoutId);
      if (containerRef.current) {
        containerRef.current.innerHTML = ''; // Cleanup any inserted content
      }
    };
  }, []); // Only run once on mount and cleanup on unmount

  return (
    <div className="tradingview-widget-container" style={{ height: '70vh', width: '100%' }}>
      <div ref={containerRef} className="tradingview-widget-container__widget" style={{ height: '100%', width: '100%' }} />
      <div className="tradingview-widget-copyright">
        <a href="https://www.tradingview.com/" rel="noopener nofollow" target="_blank">
        </a>
      </div>
    </div>
  );
}

export default MarketQuotesWidget;