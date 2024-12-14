import React, { useEffect, useRef } from 'react';

function Screener() {
  const containerRef = useRef(null);

  useEffect(() => {
    // Function to load the TradingView widget script
    const container = containerRef.current;
    const loadWidget = () => {

      if (!container) return;
      container.innerHTML = ''; 

      // Create the script tag for TradingView widget
      const script = document.createElement("script");
      script.src = "https://s3.tradingview.com/external-embedding/embed-widget-screener.js";
      script.type = 'text/javascript';
      script.async = true;

      // Widget configuration
      const widgetConfig = {
        "width": "100%",
        "height": 550,
        "defaultColumn": "overview",
        "defaultScreen": "most_capitalized",
        "market": "us",
        "showToolbar": true,
        "colorTheme": "light",
        "locale": "en"
      };

      // Assign the widget configuration to the innerHTML of the script tag
      script.innerHTML = JSON.stringify(widgetConfig);
      container.appendChild(script);
    };

    // Load the widget script when the component mounts
    const timeoutId = setTimeout(loadWidget, 100);

    // Cleanup function to remove the script when the component unmounts
    return () => {
        clearTimeout(timeoutId);
        if (container) {
          container.innerHTML = ''; // Cleanup on unmount
        }
      };
  }, []); // Empty dependency array ensures this runs once on mount

  return (
    <div className="tradingview-widget-container" ref={containerRef}>
      <div className="tradingview-widget-container__widget"></div>
      <div className="tradingview-widget-copyright">
        <a href="https://www.tradingview.com/" rel="noopener nofollow" target="_blank">
          <span className="blue-text">Track all markets on TradingView</span>
        </a>
      </div>
    </div>
  );
}

export default Screener;