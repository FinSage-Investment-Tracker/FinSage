import React, { useEffect, useRef } from 'react';

function TopMovers() {
  const containerRef = useRef(null);

  useEffect(() => {
    // Function to load the TradingView widget script
    const container = containerRef.current;
    const loadWidget = () => {

      if (!container) return;
      container.innerHTML = ''; 

      const script = document.createElement("script");
      script.src = "https://s3.tradingview.com/external-embedding/embed-widget-hotlists.js";
      script.type = 'text/javascript';
      script.async = true;

      // Widget configuration
      const widgetConfig = {
        colorTheme: "light",
        dateRange: "12M",
        exchange: "BSE",
        showChart: true,
        locale: "en",
        width: "100%",
        height: "500", // Increased height
        largeChartUrl: "",
        isTransparent: false,
        showSymbolLogo: false,
        showFloatingTooltip: false,
        plotLineColorGrowing: "rgba(41, 98, 255, 1)",
        plotLineColorFalling: "rgba(41, 98, 255, 1)",
        gridLineColor: "rgba(42, 46, 57, 0)",
        scaleFontColor: "rgba(19, 23, 34, 1)",
        belowLineFillColorGrowing: "rgba(41, 98, 255, 0.12)",
        belowLineFillColorFalling: "rgba(41, 98, 255, 0.12)",
        belowLineFillColorGrowingBottom: "rgba(41, 98, 255, 0)",
        belowLineFillColorFallingBottom: "rgba(41, 98, 255, 0)",
        symbolActiveColor: "rgba(41, 98, 255, 0.12)"
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
        </a>
      </div>
    </div>
  );
}

export default TopMovers;